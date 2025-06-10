import type { RequestHandler } from './$types';
import type { UpdatePermission, DeletePermission, CreateMemberPermission } from '$lib/types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params: { id }, locals: { service } }) => {
	const body: CreateMemberPermission = await request.json();
	const result = await service.createMemberPermission(id, body);

	return json(result);
};

export const PUT: RequestHandler = async ({ request, params: { id }, locals: { service } }) => {
	const body: UpdatePermission = await request.json();
	await service.updatePermission(id, body);

	return new Response();
};

export const DELETE: RequestHandler = async ({ request, params: { id }, locals: { service } }) => {
	const body: DeletePermission = await request.json();
	await service.deletePermission(id, body);

	return new Response();
};
