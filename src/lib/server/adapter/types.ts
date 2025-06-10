import type {
	Member,
	ProjectCreate,
	ProjectDetail,
	ProjectSimple,
	Permission,
	SharedMember
} from '$lib/types';
import type { ProjectModel } from '$lib/dbml';

/**
 * Resource adapter interface for abstracting data source operations.
 * This can be implemented using databases, REST APIs, GraphQL, or any other data source.
 * 
 * The interface is designed around domain concepts rather than storage specifics.
 */
export interface ResourceAdapter {
	// User Management
	/**
	 * Register a new user in the system
	 */
	registerUser(user: {
		id: string;
		email: string;
		name: string;
		image: string;
	}): Promise<Member>;
	
	/**
	 * Get user information
	 */
	getUser(identifier: { id: string } | { email: string }): Promise<Member | null>;

	// Project Management
	/**
	 * Create a new project with owner information
	 */
	createProject(data: {
		name: string;
		publicAccess: { view: boolean; edit?: boolean };
		ownerId: string;
	}): Promise<{
		id: string;
		name: string;
		meta: { canView: boolean; canEdit?: boolean };
		createdAt: Date;
		updatedAt: Date;
	}>;
	
	/**
	 * Get project basic information
	 */
	getProject(projectId: string): Promise<{
		id: string;
		name: string;
		meta: { canView: boolean; canEdit?: boolean };
		createdAt: Date;
		updatedAt: Date;
		isDeleted: boolean;
	} | null>;
	
	/**
	 * Get detailed project information including code and collaborators
	 */
	getProjectDetails(projectId: string): Promise<ProjectDetail | null>;
	
	/**
	 * Update project properties
	 */
	updateProject(projectId: string, updates: {
		name?: string;
		publicAccess?: { view: boolean; edit?: boolean };
	}): Promise<void>;
	
	/**
	 * Archive/delete a project
	 */
	archiveProject(projectId: string): Promise<void>;
	
	/**
	 * List projects accessible by a user
	 */
	listUserProjects(userId: string): Promise<Array<{
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

	// Project Content Management
	/**
	 * Save project code/content
	 */
	saveProjectContent(projectId: string, content: {
		code: string;
		model?: ProjectModel;
	}): Promise<void>;
	
	/**
	 * Get project code/content
	 */
	getProjectContent(projectId: string): Promise<{ code: string } | null>;

	// Collaboration Management
	/**
	 * Add a collaborator to a project
	 */
	addCollaborator(projectId: string, data: {
		userId: string;
		role: 'owner' | 'editor' | 'viewer';
		permissions?: {
			canInvite?: boolean;
		};
	}): Promise<void>;
	
	/**
	 * Update collaborator permissions
	 */
	updateCollaborator(projectId: string, userId: string, updates: {
		role?: 'editor' | 'viewer';
		permissions?: {
			canInvite?: boolean;
		};
	}): Promise<void>;
	
	/**
	 * Remove a collaborator from a project
	 */
	removeCollaborator(projectId: string, userId: string): Promise<void>;
	
	/**
	 * Get project collaborators
	 */
	getCollaborators(projectId: string): Promise<SharedMember[]>;
	
	/**
	 * Check user permissions for a project
	 */
	getUserPermissions(projectId: string, userId: string): Promise<Permission | null>;
}

/**
 * Adapter configuration
 */
export interface AdapterConfig {
	// Common configuration that all adapters might need
	// Specific implementations can extend this
}

// Re-export the existing type for backward compatibility
export type DatabaseAdapter = ResourceAdapter;