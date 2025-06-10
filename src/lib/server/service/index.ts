import type {
	Member,
	ProjectCreate,
	ProjectDetail,
	ProjectSimple,
	ProjectUpdate,
	Resource,
	UpdateMemberPermission,
	UpdatePublicPermission,
	UpdatePermission,
	Permission,
	DeletePermission,
	SharedMember,
	CreateMemberPermission
} from '$lib/types';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { member, project, projectMember, resource } from '../entity';
import { and, desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { ProjectModel } from '$lib/dbml';
import type { DefaultSession } from '@auth/core/types';
import { assertUnreachable } from '$lib/utils';
import * as MemberDefaultProfile from '$lib/fixture/member/profile-image';
import { createNotificationService, type NotificationService } from './notification-service';

type Session = {
	user: {
		id: string;
	} & DefaultSession['user'];
};

export interface IService {
	createMember: () => Promise<Member>;
	findAllProjectsOfMember: () => Promise<ProjectSimple[]>;
	findProject: (id: string) => Promise<ProjectDetail>;
	deleteProject: (id: string) => Promise<void>;
	createProject: (props: ProjectCreate) => Promise<ProjectDetail>;
	updateProject: (id: string, props: ProjectUpdate) => Promise<void>;
}

export class Service implements IService {
	#db: DrizzleD1Database<Record<string, unknown>>;
	#getSession: () => Promise<Session | null>;
	#origin: string;
	#notificationService: NotificationService;
	constructor({
		db,
		getSession,
		origin
	}: {
		db: DrizzleD1Database<Record<string, unknown>>;
		getSession: () => Promise<Session | null>;
		origin: string;
	}) {
		this.#db = db;
		this.#getSession = getSession;
		this.#origin = origin;
		this.#notificationService = createNotificationService();
	}

	async createMember(): Promise<Member> {
		const session = await this.#getSession();
		if (session == null) {
			throw fail(401, { message: 'Can not create member. reason: Unauthorized' });
		}
		const found = await this.#findMember(session.user.id);
		if (found != null) return found;

		const [result] = await this.#db
			.insert(member)
			.values({
				id: session.user.id,
				email: session.user.email ?? '',
				meta: {
					name: session.user.name ?? '',
					image: session.user.image ?? MemberDefaultProfile.image1
				}
			})
			.returning();

		const response = {
			id: result.id,
			email: result.email,
			name: result.meta.name,
			image: result.meta.image
		};

		await this.#notificationService.sendOnCreatedUser(response);

		return response;
	}

	async findAllProjectsOfMember() {
		const session = await this.#getSession();
		if (session == null) return [];
		const memberId = session.user.id;

		const result = await this.#db
			.select({
				id: project.id,
				name: project.name,
				meta: project.meta,
				permission: projectMember.permission,
				createdAt: project.createdAt,
				updatedAt: project.updatedAt
			})
			.from(projectMember)
			.innerJoin(project, eq(project.id, projectMember.projectId))
			.where(and(eq(projectMember.memberId, memberId), eq(project.isDeleted, false)))
			.orderBy(desc(project.createdAt));

		return result.map((r) => ({
			id: r.id,
			name: r.name,
			meta: r.meta,
			createdAt: r.createdAt,
			updatedAt: r.updatedAt,
			url: this.#getUrl({ name: r.name, id: r.id }),
			isOwner: r.permission.isOwner ?? false
		}));
	}

	async findProject(id: string): Promise<ProjectDetail> {
		const result = this.#db
			.select({
				id: project.id,
				name: project.name,
				meta: project.meta,
				createdAt: project.createdAt,
				updatedAt: project.updatedAt,
				resource: {
					code: resource.code
				}
			})
			.from(project)
			.innerJoin(resource, eq(resource.projectId, project.id))
			.limit(100)
			.where(and(eq(project.id, id), eq(project.isDeleted, false)));

		const sharedMembersResult = this.#db
			.select({
				id: member.id,
				name: member.email,
				meta: member.meta,
				permission: projectMember.permission
			})
			.from(projectMember)
			.innerJoin(member, eq(member.id, projectMember.memberId))
			.where(eq(projectMember.projectId, id));

		const [[found], sharedMembers] = await Promise.all([result, sharedMembersResult]);
		if (found == null) {
			throw fail(404, { message: `Can not find project ${id}. reason: Not found` });
		}

		const session = await this.#getSession();
		const permission = sharedMembers.find((m) => m.id === session?.user.id)?.permission;

		if (!found.meta.canView) {
			if (session == null) {
				throw fail(401, { message: `Can not find project ${id}. reason: Unauthorized` });
			}

			if (permission == null || (!permission.isOwner && !permission.canView)) {
				throw fail(403, { message: `Can not find project ${id}. reason: Forbidden` });
			}
		}

		return {
			id: found.id,
			name: found.name,
			url: this.#getUrl({ name: found.name, id: found.id }),
			createdAt: found.createdAt,
			updatedAt: found.updatedAt,
			resource: {
				code: found.resource.code
			},
			isOwner: permission?.isOwner ?? false,
			publicPermission: found.meta.canEdit ? 'edit' : 'view',
			permission: permission?.isOwner
				? {
						canView: true,
						canEdit: true,
						canInvite: true
					}
				: {
						canView: (found.meta?.canView || permission?.canView) ?? false,
						canEdit: (found.meta?.canEdit || permission?.canEdit) ?? false,
						canInvite: permission?.canInvite ?? false
					},
			sharedMembers: sharedMembers
				.map(
					({
						id,
						name,
						meta: { name: email, image },
						permission: { canEdit, canInvite, isOwner }
					}) => {
						let permission: Permission;
						if (isOwner || canInvite) {
							permission = 'invite';
						} else if (canEdit) {
							permission = 'edit';
						} else {
							permission = 'view';
						}
						return {
							id: id,
							name: name,
							email: email,
							image: image,
							permission,
							isOwner,
							isMe: id === session?.user.id
						};
					}
				)
				.sort((a, b) => {
					if (a.isOwner) return -1;
					if (b.isOwner) return 1;

					if (a.isMe) return -1;
					if (b.isMe) return 1;

					return 0;
				})
		};
	}

	async deleteProject(id: string) {
		const session = await this.#getSession();
		if (session == null) {
			throw fail(401, { message: `Can not delete project ${id}. reason: Unauthorized` });
		}
		const {
			user: { id: memberId }
		} = session;
		const permission = await this.#getPermission({ projectId: id, memberId });

		if (permission == null) {
			throw fail(404, { message: `Can not delete project ${id}. reason: Not found` });
		}

		const { isOwner, canEdit } = permission;
		if (!isOwner && !canEdit) {
			throw fail(403, { message: `Can not delete project ${id}. reason: Forbidden` });
		}

		await this.#db.update(project).set({ isDeleted: true }).where(eq(project.id, id));
	}

	async createProject(body: ProjectCreate): Promise<ProjectDetail> {
		const session = await this.#getSession();
		if (session == null) {
			throw fail(401, { message: `Can not create project. reason: Unauthorized` });
		}

		const {
			user: { id: memberId }
		} = session;

		const [{ id: projectId, name, meta, createdAt, updatedAt }] = await this.#db
			.insert(project)
			.values({
				id: crypto.randomUUID(),
				name: body.name ?? 'Untitled',
				meta: { canView: true },
				isDeleted: false
			})
			.returning();

		await Promise.all([
			this.#db.insert(projectMember).values({
				id: crypto.randomUUID(),
				projectId,
				memberId,
				permission: { isOwner: true, canView: true, canEdit: true, canInvite: true }
			}),
			this.#db.insert(resource).values({
				id: crypto.randomUUID(),
				projectId,
				code: body.resource.code,
				model: {} as ProjectModel
			})
		]);

		return {
			id: projectId,
			name,
			url: this.#getUrl({ name, id: projectId }),
			createdAt,
			updatedAt,
			isOwner: true,
			resource: {
				code: body.resource.code
			},
			publicPermission: meta.canEdit ? ('edit' as const) : ('view' as const),
			permission: {
				canView: true,
				canEdit: true,
				canInvite: true
			},
			sharedMembers: []
		};
	}

	async updateProject(id: string, body: { name?: string; resource?: Resource }) {
		const found = await this.#findProject(id);
		if (found == null) {
			throw fail(404, { message: `Can not update project ${id}. reason: Not found` });
		}

		const session = await this.#getSession();
		let forbidden = false;
		if (session == null) {
			if (!found.meta.canEdit) {
				forbidden = true;
			}
		} else {
			const { isOwner, canEdit } = await this.#getPermission({
				projectId: id,
				memberId: session.user.id
			});

			if (!isOwner && !canEdit) {
				forbidden = true;
			}
		}

		if (forbidden) {
			throw fail(403, { message: `Can not update project ${id}. reason: Forbidden` });
		}
		let updateProjectPromise;
		if (body.name != null) {
			updateProjectPromise = this.#db
				.update(project)
				.set({ name: body.name, updatedAt: new Date() })
				.where(eq(project.id, id));
		}

		let updateResourcePromise;
		if (body.resource != null) {
			updateResourcePromise = this.#db
				.update(resource)
				.set({ code: body.resource.code })
				.where(eq(resource.projectId, id));
		}

		await Promise.all([updateProjectPromise, updateResourcePromise]);
	}

	async updatePermission(id: string, body: UpdatePermission): Promise<void> {
		if (body.type === 'public') {
			return this.#updatePublicPermission(id, body);
		} else {
			return this.#updateMemberPermission(id, body);
		}
	}

	async #updatePublicPermission(
		projectId: string,
		{ permission }: UpdatePublicPermission
	): Promise<void> {
		await this.#validateBeforePermissionUpdate({ projectId });
		const found = await this.#findProject(projectId);
		if (found == null) {
			throw fail(404, {
				message: `Can not update permission. reason: Not found project ${projectId}`
			});
		}

		await this.#db
			.update(project)
			.set({ meta: { ...found.meta, ...this.#resolvePermission(permission) } })
			.where(eq(project.id, projectId));
	}

	async createMemberPermission(
		projectId: string,
		{ email, permission }: CreateMemberPermission
	): Promise<SharedMember> {
		await this.#validateBeforePermissionUpdate({ projectId });
		const [found] = await this.#db.select().from(member).where(eq(member.email, email)).execute();
		if (found == null) {
			throw fail(404, {
				message: `Can not update permission. reason: Not found member ${email}`
			});
		}

		await this.#db
			.insert(projectMember)
			.values({
				id: crypto.randomUUID(),
				memberId: found.id,
				projectId,
				permission: this.#resolvePermission(permission)
			})
			.execute();

		return {
			...found,
			name: found.meta.name,
			image: found.meta.image,
			permission
		};
	}

	async #updateMemberPermission(
		projectId: string,
		{ memberId, permission }: UpdateMemberPermission
	): Promise<void> {
		await this.#validateBeforePermissionUpdate({ projectId });

		const member = await this.#findMember(memberId);
		if (member == null) {
			throw fail(404, {
				message: `Can not update permission. reason: Not found member ${memberId}`
			});
		}
		await this.#db
			.update(projectMember)
			.set({ permission: this.#resolvePermission(permission) })
			.where(and(eq(projectMember.memberId, memberId), eq(projectMember.projectId, projectId)))
			.execute();
	}

	async deletePermission(projectId: string, { memberId }: DeletePermission) {
		await this.#db
			.delete(projectMember)
			.where(and(eq(projectMember.projectId, projectId), eq(projectMember.memberId, memberId)))
			.execute();
	}

	async #getPermission({ projectId, memberId }: { projectId: string; memberId: string }) {
		const [{ permission }] = await this.#db
			.select({ permission: projectMember.permission })
			.from(projectMember)
			.where(and(eq(projectMember.projectId, projectId), eq(projectMember.memberId, memberId)));
		return permission;
	}

	#getUrl(project: { name: string; id: string }) {
		if (!project.name) return `/workspace/${project.id}`;

		const name = project.name.replace(/ /g, '-').toLowerCase();
		return `${this.#origin}/workspace/${name}-${project.id}`;
	}

	#resolvePermission(permission: Permission) {
		switch (permission) {
			case 'view':
				return { canView: true, canEdit: false, canInvite: false };
			case 'edit':
				return { canView: true, canEdit: true, canInvite: false };
			case 'invite':
				return { canView: true, canEdit: true, canInvite: true };
			default:
				assertUnreachable(permission, 'Invalid permission');
		}
	}

	async #findMember(id: string) {
		const members = await this.#db.select().from(member).where(eq(member.id, id));
		if (members.length == 0) return null;
		const result = members[0];

		return {
			id: result.id,
			name: result.meta.name,
			email: result.email,
			image: result.meta.image
		};
	}

	async #findProject(id: string) {
		const [found] = await this.#db.select().from(project).where(eq(project.id, id)).execute();
		return found;
	}

	async #validateBeforePermissionUpdate({ projectId }: { projectId: string }) {
		const session = await this.#getSession();
		if (session == null) {
			throw fail(401, { message: `Can not update permission. reason: Unauthorized` });
		}

		const [me] = await this.#db
			.select({
				id: projectMember.id,
				permission: projectMember.permission
			})
			.from(projectMember)
			.where(
				and(eq(projectMember.memberId, session.user.id), eq(projectMember.projectId, projectId))
			)
			.execute();

		if (!me.permission.canInvite) {
			throw fail(403, { message: `Can not update permission. reason: Forbidden id: ${me.id}` });
		}
	}
}
