import type {
	ProjectCreate,
	ProjectDetail,
	ProjectUpdate,
	UpdatePermission,
	DeletePermission,
	CreateMemberPermission,
	SharedMember
} from '$lib/types';
import type { Client } from './base';
export default function project({ post, del, put }: Client) {
	return {
		update: (id: string, body: ProjectUpdate): Promise<void> => {
			return put(`/api/project/${id}`, body);
		},
		create: (body: ProjectCreate): Promise<ProjectDetail> => {
			return post('/api/project', body);
		},
		delete: async (id: string): Promise<void> => {
			await del(`/api/project/${id}`);
		},
		createMemberPermission: (id: string, body: CreateMemberPermission): Promise<SharedMember> => {
			return post(`/api/project/${id}/permission`, body);
		},
		updatePermission: (id: string, body: UpdatePermission): Promise<void> => {
			return put(`/api/project/${id}/permission`, body);
		},
		deletePermission: async (id: string, body: DeletePermission): Promise<void> => {
			return del(`/api/project/${id}/permission`, body);
		}
	};
}
