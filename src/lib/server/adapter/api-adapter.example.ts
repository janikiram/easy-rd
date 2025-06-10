import type { ResourceAdapter } from './types';
import type { Member, ProjectSimple, ProjectDetail, Permission, SharedMember } from '$lib/types';
import type { ProjectModel } from '$lib/dbml';

/**
 * Example REST API implementation of the ResourceAdapter interface.
 * This demonstrates how to implement the adapter using HTTP requests to a backend API.
 * 
 * This is just an example - you would need to implement the actual API endpoints.
 */
export class APIAdapter implements ResourceAdapter {
	private apiUrl: string;
	private headers: HeadersInit;

	constructor(config: { apiUrl: string; apiKey?: string }) {
		this.apiUrl = config.apiUrl;
		this.headers = {
			'Content-Type': 'application/json',
			...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
		};
	}

	private async request<T>(path: string, options?: RequestInit): Promise<T> {
		const response = await fetch(`${this.apiUrl}${path}`, {
			...options,
			headers: {
				...this.headers,
				...options?.headers
			}
		});

		if (!response.ok) {
			throw new Error(`API Error: ${response.status} ${response.statusText}`);
		}

		return response.json();
	}

	// User Management
	async registerUser(user: {
		id: string;
		email: string;
		name: string;
		image: string;
	}): Promise<Member> {
		return this.request<Member>('/users', {
			method: 'POST',
			body: JSON.stringify(user)
		});
	}

	async getUser(identifier: { id: string } | { email: string }): Promise<Member | null> {
		const params = new URLSearchParams();
		if ('id' in identifier) {
			params.set('id', identifier.id);
		} else {
			params.set('email', identifier.email);
		}

		try {
			return await this.request<Member>(`/users?${params}`);
		} catch (error) {
			return null;
		}
	}

	// Project Management
	async createProject(data: {
		name: string;
		publicAccess: { view: boolean; edit?: boolean };
	}): Promise<ProjectSimple> {
		return this.request<ProjectSimple>('/projects', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async getProject(projectId: string): Promise<ProjectSimple | null> {
		try {
			return await this.request<ProjectSimple>(`/projects/${projectId}`);
		} catch (error) {
			return null;
		}
	}

	async getProjectDetails(projectId: string): Promise<ProjectDetail | null> {
		try {
			return await this.request<ProjectDetail>(`/projects/${projectId}/details`);
		} catch (error) {
			return null;
		}
	}

	async updateProject(projectId: string, updates: {
		name?: string;
		publicAccess?: { view: boolean; edit?: boolean };
	}): Promise<void> {
		await this.request(`/projects/${projectId}`, {
			method: 'PATCH',
			body: JSON.stringify(updates)
		});
	}

	async archiveProject(projectId: string): Promise<void> {
		await this.request(`/projects/${projectId}`, {
			method: 'DELETE'
		});
	}

	async listUserProjects(userId: string): Promise<Array<{
		project: ProjectSimple;
		role: 'owner' | 'collaborator' | 'viewer';
	}>> {
		return this.request<Array<{
			project: ProjectSimple;
			role: 'owner' | 'collaborator' | 'viewer';
		}>>(`/users/${userId}/projects`);
	}

	// Project Content Management
	async saveProjectContent(projectId: string, content: {
		code: string;
		model?: ProjectModel;
	}): Promise<void> {
		await this.request(`/projects/${projectId}/content`, {
			method: 'PUT',
			body: JSON.stringify(content)
		});
	}

	async getProjectContent(projectId: string): Promise<{ code: string } | null> {
		try {
			return await this.request<{ code: string }>(`/projects/${projectId}/content`);
		} catch (error) {
			return null;
		}
	}

	// Collaboration Management
	async addCollaborator(projectId: string, data: {
		userId: string;
		role: 'owner' | 'editor' | 'viewer';
		permissions?: {
			canInvite?: boolean;
		};
	}): Promise<void> {
		await this.request(`/projects/${projectId}/collaborators`, {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async updateCollaborator(projectId: string, userId: string, updates: {
		role?: 'editor' | 'viewer';
		permissions?: {
			canInvite?: boolean;
		};
	}): Promise<void> {
		await this.request(`/projects/${projectId}/collaborators/${userId}`, {
			method: 'PATCH',
			body: JSON.stringify(updates)
		});
	}

	async removeCollaborator(projectId: string, userId: string): Promise<void> {
		await this.request(`/projects/${projectId}/collaborators/${userId}`, {
			method: 'DELETE'
		});
	}

	async getCollaborators(projectId: string): Promise<SharedMember[]> {
		return this.request<SharedMember[]>(`/projects/${projectId}/collaborators`);
	}

	async getUserPermissions(projectId: string, userId: string): Promise<Permission | null> {
		try {
			return await this.request<Permission>(`/projects/${projectId}/permissions/${userId}`);
		} catch (error) {
			return null;
		}
	}
}

/**
 * Example usage:
 * 
 * // In your hooks.server.ts or app initialization
 * import { APIAdapter } from '$lib/server/adapter/api-adapter';
 * import { createAdapterHandler } from '$lib/server/adapter';
 * 
 * const apiAdapter = new APIAdapter({
 *   apiUrl: 'https://api.easy-rd.dev',
 *   apiKey: process.env.API_KEY
 * });
 * 
 * export const handle = createAdapterHandler(apiAdapter);
 */