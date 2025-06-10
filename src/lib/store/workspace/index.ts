import type {
	CreateMemberPermission,
	DeletePermission,
	ProjectCreate,
	ProjectDetail,
	ProjectSimple,
	ProjectUpdate,
	UpdateMemberPermission,
	UpdatePublicPermission
} from '$lib/types';
import { basic } from '$lib/fixture/code';
import writableOnlyClient from '../writable-only-client';
import api from '$lib/api';
import { debounce } from '$lib/utils';
import { get } from 'svelte/store';

type Response = { type: 'error' | 'success'; message: string };

export const DEFAULT_PROJECT: ProjectDetail = Object.freeze({
	id: '',
	name: '',
	createdAt: new Date(),
	updatedAt: new Date(),
	isOwner: true,
	url: '',
	publicPermission: 'view',
	permission: {
		canEdit: true,
		canInvite: true,
		canView: true
	},
	resource: {
		code: basic
	},
	sharedMembers: []
});
export const EMPTY_PROJECT: ProjectDetail = Object.freeze({
	...DEFAULT_PROJECT,
	resource: {
		code: ''
	}
});

class ProjectManager {
	readonly projects = writableOnlyClient<ProjectSimple[]>([]);
	readonly project = writableOnlyClient<ProjectDetail>(DEFAULT_PROJECT);
	private get id() {
		return get(this.project).id;
	}

	async create(body: ProjectCreate) {
		const newProject = await api.project.create(body);
		this.projects.update((prev) => [newProject, ...prev]);
		return newProject;
	}

	load({ project, projects }: { projects?: ProjectSimple[]; project?: ProjectDetail }) {
		if (project) this.project.set(project);
		if (projects) this.projects.set(projects);
	}

	/**
	 * TODO: project.subscribe로 update 기능을 대체할 것.
	 * 하지만 변경점이 name, resource 인지 구분할 수 있어야 하기 때문에, writable을 새로 작성해야함.
	 */
	update(body: ProjectUpdate) {
		if (!this.id) return;
		if (!get(this.project).permission.canEdit) return;

		const { name, resource } = body;
		if (name) {
			document.title = `${get(this.project).name || 'Untitled'} - easy-rd.dev`;
			this.projects.update((prev) => prev.map((p) => (p.id === this.id ? { ...p, name } : p)));
			this.#autoSaveTitle({ name });
		}

		if (resource) {
			this.#autoSaveResource({ resource });
		}
	}

	async delete(id: string) {
		this.projects.update((prev) => prev.filter((p) => p.id !== id));
		await api.project.delete(id);
	}

	async invite(body: CreateMemberPermission): Promise<Response> {
		return await api.project
			.createMemberPermission(this.id, body)
			.then((member) => {
				this.project.update((prev) => ({
					...prev,
					sharedMembers: [...prev.sharedMembers, member]
				}));
				return { type: 'success' as const, message: 'Member invited successfully' };
			})
			.catch(() => {
				return {
					type: 'error' as const,
					message: 'Failed to invite member. Maybe email is not valid.'
				};
			});
	}

	async updatePermissionMember(body: UpdateMemberPermission): Promise<Response> {
		return await api.project
			.updatePermission(this.id, { type: 'member', ...body })
			.then(() => {
				this.project.update((prev) => ({
					...prev,
					sharedMembers: prev.sharedMembers.map((m) =>
						m.id === body.memberId ? { ...m, permission: body.permission } : m
					)
				}));
				return { type: 'success' as const, message: 'Permission updated successfully' };
			})
			.catch((e) => {
				console.log(e);
				return { type: 'error' as const, message: 'Failed to update permission' };
			});
	}
	async updatePublicPermission(body: UpdatePublicPermission): Promise<Response> {
		return await api.project
			.updatePermission(this.id, { type: 'public', ...body })
			.then(() => {
				this.project.update((prev) => ({
					...prev,
					publicPermission: body.permission,
					permission: {
						...prev.permission
					}
				}));
				return { type: 'success' as const, message: 'Permission updated successfully' };
			})
			.catch(() => {
				return { type: 'error' as const, message: 'Failed to update permission' };
			});
	}

	async deleteMemberPermission(body: DeletePermission) {
		await api.project.deletePermission(this.id, body).then(() => {
			this.project.update((prev) => ({
				...prev,
				sharedMembers: prev.sharedMembers.filter((m) => m.id !== body.memberId)
			}));
		});
	}

	#autoSaveTitle = debounce(({ name }: { name: string }) => {
		api.project.update(this.id, { name });
	}, 300);

	#autoSaveResource = debounce(({ resource }: { resource: ProjectUpdate['resource'] }) => {
		api.project.update(this.id, { resource });
	}, 3000);
}

export const projectManager = new ProjectManager();
