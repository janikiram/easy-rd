import type {
	Member,
	ProjectCreate,
	ProjectDetail,
	ProjectSimple,
	Resource,
	Permission,
	SharedMember
} from '$lib/types';
import type { ProjectModel } from '$lib/dbml';

/**
 * Database adapter interface that abstracts database operations.
 * This allows switching between different ORMs or database implementations.
 */
export interface DatabaseAdapter {
	// Member operations
	createMember(data: {
		id: string;
		email: string;
		name: string;
		image: string;
	}): Promise<Member>;
	
	findMemberById(id: string): Promise<Member | null>;
	findMemberByEmail(email: string): Promise<Member | null>;

	// Project operations
	createProject(data: {
		name: string;
		meta: { canView: boolean; canEdit?: boolean };
	}): Promise<{
		id: string;
		name: string;
		meta: { canView: boolean; canEdit?: boolean };
		createdAt: Date;
		updatedAt: Date;
	}>;
	
	findProjectById(id: string): Promise<{
		id: string;
		name: string;
		meta: { canView: boolean; canEdit?: boolean };
		createdAt: Date;
		updatedAt: Date;
		isDeleted: boolean;
	} | null>;
	
	updateProject(id: string, data: {
		name?: string;
		meta?: { canView: boolean; canEdit?: boolean };
		updatedAt: Date;
	}): Promise<void>;
	
	deleteProject(id: string): Promise<void>;
	
	// Resource operations
	createResource(data: {
		projectId: string;
		code: string;
		model: ProjectModel;
	}): Promise<void>;
	
	updateResource(projectId: string, code: string): Promise<void>;
	
	findResourceByProjectId(projectId: string): Promise<{
		code: string;
	} | null>;
	
	// Project member operations
	createProjectMember(data: {
		projectId: string;
		memberId: string;
		permission: {
			isOwner?: boolean;
			canView: boolean;
			canEdit: boolean;
			canInvite: boolean;
		};
	}): Promise<void>;
	
	findProjectMembersByProjectId(projectId: string): Promise<Array<{
		member: Member;
		permission: {
			isOwner?: boolean;
			canView: boolean;
			canEdit: boolean;
			canInvite: boolean;
		};
	}>>;
	
	findProjectMember(projectId: string, memberId: string): Promise<{
		permission: {
			isOwner?: boolean;
			canView: boolean;
			canEdit: boolean;
			canInvite: boolean;
		};
	} | null>;
	
	updateProjectMemberPermission(
		projectId: string,
		memberId: string,
		permission: {
			canView: boolean;
			canEdit: boolean;
			canInvite: boolean;
		}
	): Promise<void>;
	
	deleteProjectMember(projectId: string, memberId: string): Promise<void>;
	
	// Complex queries
	findProjectsByMemberId(memberId: string): Promise<Array<{
		project: {
			id: string;
			name: string;
			meta: { canView: boolean; canEdit?: boolean };
			createdAt: Date;
			updatedAt: Date;
		};
		permission: {
			isOwner?: boolean;
			canView: boolean;
			canEdit: boolean;
			canInvite: boolean;
		};
	}>>;
	
	findProjectWithDetails(projectId: string): Promise<{
		project: {
			id: string;
			name: string;
			meta: { canView: boolean; canEdit?: boolean };
			createdAt: Date;
			updatedAt: Date;
		};
		resource: {
			code: string;
		};
		members: Array<{
			member: Member;
			permission: {
				isOwner?: boolean;
				canView: boolean;
				canEdit: boolean;
				canInvite: boolean;
			};
		}>;
	} | null>;
}

/**
 * Database connection configuration
 */
export interface DatabaseConfig {
	// Add common database configuration options here
	// These will be extended by specific implementations
}