import type { DatabaseAdapter } from './types';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { member, project, projectMember, resource } from '../entity';
import { and, eq, desc } from 'drizzle-orm';
import type { Member } from '$lib/types';
import type { ProjectModel } from '$lib/dbml';

/**
 * Drizzle ORM implementation of the DatabaseAdapter interface.
 * This is the default implementation used by Easy RD.
 */
export class DrizzleAdapter implements DatabaseAdapter {
	constructor(private db: DrizzleD1Database<Record<string, unknown>>) {}

	async createMember(data: {
		id: string;
		email: string;
		name: string;
		image: string;
	}): Promise<Member> {
		const [result] = await this.db
			.insert(member)
			.values({
				id: data.id,
				email: data.email,
				meta: {
					name: data.name,
					image: data.image
				}
			})
			.returning();

		return {
			id: result.id,
			email: result.email,
			name: result.meta.name,
			image: result.meta.image
		};
	}

	async findMemberById(id: string): Promise<Member | null> {
		const [result] = await this.db
			.select()
			.from(member)
			.where(eq(member.id, id))
			.limit(1);

		if (!result) return null;

		return {
			id: result.id,
			email: result.email,
			name: result.meta.name,
			image: result.meta.image
		};
	}

	async findMemberByEmail(email: string): Promise<Member | null> {
		const [result] = await this.db
			.select()
			.from(member)
			.where(eq(member.email, email))
			.limit(1);

		if (!result) return null;

		return {
			id: result.id,
			email: result.email,
			name: result.meta.name,
			image: result.meta.image
		};
	}

	async createProject(data: {
		name: string;
		meta: { canView: boolean; canEdit?: boolean };
	}) {
		const [result] = await this.db
			.insert(project)
			.values({
				id: crypto.randomUUID(),
				name: data.name,
				meta: data.meta,
				isDeleted: false
			})
			.returning();

		return {
			id: result.id,
			name: result.name,
			meta: {
				canView: result.meta.canView ?? true,
				canEdit: result.meta.canEdit
			},
			createdAt: result.createdAt,
			updatedAt: result.updatedAt
		};
	}

	async findProjectById(id: string) {
		const [result] = await this.db
			.select()
			.from(project)
			.where(eq(project.id, id))
			.limit(1);

		if (!result) return null;

		return {
			id: result.id,
			name: result.name,
			meta: {
				canView: result.meta.canView ?? true,
				canEdit: result.meta.canEdit
			},
			createdAt: result.createdAt,
			updatedAt: result.updatedAt,
			isDeleted: result.isDeleted
		};
	}

	async updateProject(
		id: string,
		data: {
			name?: string;
			meta?: { canView: boolean; canEdit?: boolean };
			updatedAt: Date;
		}
	): Promise<void> {
		await this.db
			.update(project)
			.set(data)
			.where(eq(project.id, id));
	}

	async deleteProject(id: string): Promise<void> {
		await this.db
			.update(project)
			.set({ isDeleted: true })
			.where(eq(project.id, id));
	}

	async createResource(data: {
		projectId: string;
		code: string;
		model: ProjectModel;
	}): Promise<void> {
		await this.db.insert(resource).values({
			id: crypto.randomUUID(),
			projectId: data.projectId,
			code: data.code,
			model: data.model
		});
	}

	async updateResource(projectId: string, code: string): Promise<void> {
		await this.db
			.update(resource)
			.set({ code })
			.where(eq(resource.projectId, projectId));
	}

	async findResourceByProjectId(projectId: string) {
		const [result] = await this.db
			.select({ code: resource.code })
			.from(resource)
			.where(eq(resource.projectId, projectId))
			.limit(1);

		return result;
	}

	async createProjectMember(data: {
		projectId: string;
		memberId: string;
		permission: {
			isOwner?: boolean;
			canView: boolean;
			canEdit: boolean;
			canInvite: boolean;
		};
	}): Promise<void> {
		await this.db.insert(projectMember).values({
			id: crypto.randomUUID(),
			projectId: data.projectId,
			memberId: data.memberId,
			permission: data.permission
		});
	}

	async findProjectMembersByProjectId(projectId: string) {
		const results = await this.db
			.select({
				member: member,
				permission: projectMember.permission
			})
			.from(projectMember)
			.innerJoin(member, eq(member.id, projectMember.memberId))
			.where(eq(projectMember.projectId, projectId));

		return results.map(({ member: m, permission }) => ({
			member: {
				id: m.id,
				email: m.email,
				name: m.meta.name,
				image: m.meta.image
			},
			permission: {
				isOwner: permission.isOwner,
				canView: permission.canView ?? true,
				canEdit: permission.canEdit ?? false,
				canInvite: permission.canInvite ?? false
			}
		}));
	}

	async findProjectMember(projectId: string, memberId: string) {
		const [result] = await this.db
			.select({ permission: projectMember.permission })
			.from(projectMember)
			.where(
				and(
					eq(projectMember.projectId, projectId),
					eq(projectMember.memberId, memberId)
				)
			)
			.limit(1);

		if (!result) return null;

		return {
			permission: {
				isOwner: result.permission.isOwner,
				canView: result.permission.canView ?? true,
				canEdit: result.permission.canEdit ?? false,
				canInvite: result.permission.canInvite ?? false
			}
		};
	}

	async updateProjectMemberPermission(
		projectId: string,
		memberId: string,
		permission: {
			canView: boolean;
			canEdit: boolean;
			canInvite: boolean;
		}
	): Promise<void> {
		await this.db
			.update(projectMember)
			.set({ permission })
			.where(
				and(
					eq(projectMember.projectId, projectId),
					eq(projectMember.memberId, memberId)
				)
			);
	}

	async deleteProjectMember(projectId: string, memberId: string): Promise<void> {
		await this.db
			.delete(projectMember)
			.where(
				and(
					eq(projectMember.projectId, projectId),
					eq(projectMember.memberId, memberId)
				)
			);
	}

	async findProjectsByMemberId(memberId: string) {
		const results = await this.db
			.select({
				project: project,
				permission: projectMember.permission
			})
			.from(projectMember)
			.innerJoin(project, eq(project.id, projectMember.projectId))
			.where(
				and(
					eq(projectMember.memberId, memberId),
					eq(project.isDeleted, false)
				)
			)
			.orderBy(desc(project.createdAt));

		return results.map(({ project: p, permission }) => ({
			project: {
				id: p.id,
				name: p.name,
				meta: {
					canView: p.meta.canView ?? true,
					canEdit: p.meta.canEdit
				},
				createdAt: p.createdAt,
				updatedAt: p.updatedAt
			},
			permission: {
				isOwner: permission.isOwner,
				canView: permission.canView ?? true,
				canEdit: permission.canEdit ?? false,
				canInvite: permission.canInvite ?? false
			}
		}));
	}

	async findProjectWithDetails(projectId: string) {
		const projectResult = await this.db
			.select({
				project: project,
				resource: resource
			})
			.from(project)
			.innerJoin(resource, eq(resource.projectId, project.id))
			.where(
				and(
					eq(project.id, projectId),
					eq(project.isDeleted, false)
				)
			)
			.limit(1);

		if (!projectResult[0]) return null;

		const members = await this.findProjectMembersByProjectId(projectId);

		return {
			project: {
				id: projectResult[0].project.id,
				name: projectResult[0].project.name,
				meta: {
					canView: projectResult[0].project.meta.canView ?? true,
					canEdit: projectResult[0].project.meta.canEdit
				},
				createdAt: projectResult[0].project.createdAt,
				updatedAt: projectResult[0].project.updatedAt
			},
			resource: {
				code: projectResult[0].resource.code
			},
			members
		};
	}
}