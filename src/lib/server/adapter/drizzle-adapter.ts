import type { ResourceAdapter } from './types';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { member, project, projectMember, resource } from '../entity';
import { and, eq, desc } from 'drizzle-orm';
import type { Member, ProjectSimple, ProjectDetail, Permission, SharedMember } from '$lib/types';
import type { ProjectModel } from '$lib/dbml';

/**
 * Drizzle ORM implementation of the ResourceAdapter interface.
 * This implementation uses Cloudflare D1 with Drizzle ORM.
 */
export class DrizzleAdapter implements ResourceAdapter {
	constructor(private db: DrizzleD1Database<Record<string, unknown>>) {}

	// User Management
	async registerUser(user: {
		id: string;
		email: string;
		name: string;
		image: string;
	}): Promise<Member> {
		const [result] = await this.db
			.insert(member)
			.values({
				id: user.id,
				email: user.email,
				meta: {
					name: user.name,
					image: user.image
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

	async getUser(identifier: { id: string } | { email: string }): Promise<Member | null> {
		const condition = 'id' in identifier 
			? eq(member.id, identifier.id)
			: eq(member.email, identifier.email);

		const [result] = await this.db
			.select()
			.from(member)
			.where(condition)
			.limit(1);

		if (!result) return null;

		return {
			id: result.id,
			email: result.email,
			name: result.meta.name,
			image: result.meta.image
		};
	}

	// Project Management
	async createProject(data: {
		name: string;
		publicAccess: { view: boolean; edit?: boolean };
	}): Promise<ProjectSimple> {
		const [result] = await this.db
			.insert(project)
			.values({
				id: crypto.randomUUID(),
				name: data.name,
				meta: {
					canView: data.publicAccess.view,
					canEdit: data.publicAccess.edit
				},
				isDeleted: false
			})
			.returning();

		return {
			id: result.id,
			name: result.name,
			publicPermission: data.publicAccess.edit ? 'edit' : data.publicAccess.view ? 'view' : 'none',
			permission: {
				canView: true,
				canEdit: true,
				canInvite: true
			},
			isOwner: true,
			createdAt: result.createdAt,
			updatedAt: result.updatedAt
		};
	}

	async getProject(projectId: string): Promise<ProjectSimple | null> {
		const [result] = await this.db
			.select()
			.from(project)
			.where(and(
				eq(project.id, projectId),
				eq(project.isDeleted, false)
			))
			.limit(1);

		if (!result) return null;

		// For basic project info, we'll need to check permissions separately
		// This is a simplified version - in real implementation, you'd join with projectMember
		return {
			id: result.id,
			name: result.name,
			publicPermission: result.meta.canEdit ? 'edit' : result.meta.canView ? 'view' : 'none',
			permission: {
				canView: result.meta.canView ?? true,
				canEdit: result.meta.canEdit ?? false,
				canInvite: false
			},
			isOwner: false,
			createdAt: result.createdAt,
			updatedAt: result.updatedAt
		};
	}

	async getProjectDetails(projectId: string): Promise<ProjectDetail | null> {
		const projectResult = await this.db
			.select({
				project: project,
				resource: resource
			})
			.from(project)
			.leftJoin(resource, eq(resource.projectId, project.id))
			.where(and(
				eq(project.id, projectId),
				eq(project.isDeleted, false)
			))
			.limit(1);

		if (!projectResult[0]) return null;

		const collaborators = await this.getCollaborators(projectId);

		const { project: p, resource: r } = projectResult[0];

		return {
			id: p.id,
			name: p.name,
			publicPermission: p.meta.canEdit ? 'edit' : p.meta.canView ? 'view' : 'none',
			permission: {
				canView: p.meta.canView ?? true,
				canEdit: p.meta.canEdit ?? false,
				canInvite: false
			},
			isOwner: false,
			createdAt: p.createdAt,
			updatedAt: p.updatedAt,
			url: '', // This should be constructed based on your URL scheme
			resource: {
				code: r?.code || ''
			},
			sharedMembers: collaborators
		};
	}

	async updateProject(projectId: string, updates: {
		name?: string;
		publicAccess?: { view: boolean; edit?: boolean };
	}): Promise<void> {
		const updateData: any = {
			updatedAt: new Date()
		};

		if (updates.name) {
			updateData.name = updates.name;
		}

		if (updates.publicAccess) {
			updateData.meta = {
				canView: updates.publicAccess.view,
				canEdit: updates.publicAccess.edit
			};
		}

		await this.db
			.update(project)
			.set(updateData)
			.where(eq(project.id, projectId));
	}

	async archiveProject(projectId: string): Promise<void> {
		await this.db
			.update(project)
			.set({ isDeleted: true })
			.where(eq(project.id, projectId));
	}

	async listUserProjects(userId: string): Promise<Array<{
		project: ProjectSimple;
		role: 'owner' | 'collaborator' | 'viewer';
	}>> {
		const results = await this.db
			.select({
				project: project,
				permission: projectMember.permission
			})
			.from(projectMember)
			.innerJoin(project, eq(project.id, projectMember.projectId))
			.where(and(
				eq(projectMember.memberId, userId),
				eq(project.isDeleted, false)
			))
			.orderBy(desc(project.createdAt));

		return results.map(({ project: p, permission }) => {
			const role: 'owner' | 'collaborator' | 'viewer' = 
				permission.isOwner ? 'owner' :
				permission.canEdit ? 'collaborator' : 'viewer';

			return {
				project: {
					id: p.id,
					name: p.name,
					publicPermission: p.meta.canEdit ? 'edit' : p.meta.canView ? 'view' : 'none',
					permission: {
						canView: permission.canView ?? true,
						canEdit: permission.canEdit ?? false,
						canInvite: permission.canInvite ?? false
					},
					isOwner: permission.isOwner ?? false,
					createdAt: p.createdAt,
					updatedAt: p.updatedAt
				},
				role
			};
		});
	}

	// Project Content Management
	async saveProjectContent(projectId: string, content: {
		code: string;
		model?: ProjectModel;
	}): Promise<void> {
		const existingResource = await this.db
			.select()
			.from(resource)
			.where(eq(resource.projectId, projectId))
			.limit(1);

		if (existingResource[0]) {
			await this.db
				.update(resource)
				.set({ 
					code: content.code,
					model: content.model || existingResource[0].model
				})
				.where(eq(resource.projectId, projectId));
		} else {
			await this.db.insert(resource).values({
				id: crypto.randomUUID(),
				projectId: projectId,
				code: content.code,
				model: content.model || {} as ProjectModel
			});
		}
	}

	async getProjectContent(projectId: string): Promise<{ code: string } | null> {
		const [result] = await this.db
			.select({ code: resource.code })
			.from(resource)
			.where(eq(resource.projectId, projectId))
			.limit(1);

		return result;
	}

	// Collaboration Management
	async addCollaborator(projectId: string, data: {
		userId: string;
		role: 'owner' | 'editor' | 'viewer';
		permissions?: {
			canInvite?: boolean;
		};
	}): Promise<void> {
		const permission = {
			isOwner: data.role === 'owner',
			canView: true,
			canEdit: data.role !== 'viewer',
			canInvite: data.permissions?.canInvite ?? false
		};

		await this.db.insert(projectMember).values({
			id: crypto.randomUUID(),
			projectId: projectId,
			memberId: data.userId,
			permission
		});
	}

	async updateCollaborator(projectId: string, userId: string, updates: {
		role?: 'editor' | 'viewer';
		permissions?: {
			canInvite?: boolean;
		};
	}): Promise<void> {
		const permission: any = {};

		if (updates.role) {
			permission.canEdit = updates.role === 'editor';
		}

		if (updates.permissions?.canInvite !== undefined) {
			permission.canInvite = updates.permissions.canInvite;
		}

		await this.db
			.update(projectMember)
			.set({ permission })
			.where(and(
				eq(projectMember.projectId, projectId),
				eq(projectMember.memberId, userId)
			));
	}

	async removeCollaborator(projectId: string, userId: string): Promise<void> {
		await this.db
			.delete(projectMember)
			.where(and(
				eq(projectMember.projectId, projectId),
				eq(projectMember.memberId, userId)
			));
	}

	async getCollaborators(projectId: string): Promise<SharedMember[]> {
		const results = await this.db
			.select({
				member: member,
				permission: projectMember.permission
			})
			.from(projectMember)
			.innerJoin(member, eq(member.id, projectMember.memberId))
			.where(eq(projectMember.projectId, projectId));

		return results.map(({ member: m, permission }) => ({
			id: m.id,
			email: m.email,
			name: m.meta.name,
			image: m.meta.image,
			permission: {
				canEdit: permission.canEdit ?? false,
				canInvite: permission.canInvite ?? false
			}
		}));
	}

	async getUserPermissions(projectId: string, userId: string): Promise<Permission | null> {
		const [result] = await this.db
			.select({ permission: projectMember.permission })
			.from(projectMember)
			.where(and(
				eq(projectMember.projectId, projectId),
				eq(projectMember.memberId, userId)
			))
			.limit(1);

		if (!result) return null;

		return {
			canView: result.permission.canView ?? true,
			canEdit: result.permission.canEdit ?? false,
			canInvite: result.permission.canInvite ?? false
		};
	}
}