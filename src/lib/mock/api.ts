import type { API } from '$lib/api';
import { advanced } from '$lib/fixture/project';
import { createMember } from '$lib/fixture/member';
import type { CreateMemberPermission, UpdatePermission } from '$lib/types';

const api: API = {
	project: {
		create: async () => {
			return advanced;
		},
		update: async () => {},
		delete: async () => {},
		createMemberPermission: async (id: string, body: CreateMemberPermission) => {
			if (body.email.includes('invalid')) throw new Error('inValid Email');

			console.debug('createPermission', body);
			return { ...createMember({ email: body.email }), permission: body.permission };
		},
		updatePermission: async (id: string, body: UpdatePermission) => {
			console.debug('updatePermission', id, body);
		},
		deletePermission: async () => {}
	}
};

export default api;
