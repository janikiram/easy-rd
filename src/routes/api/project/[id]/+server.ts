import { fail, json, type RequestHandler } from '@sveltejs/kit';
import type { ProjectUpdate } from '$lib/types';

export const PUT: RequestHandler = async ({ params: { id }, request, locals: { service } }) => {
	if (!id) {
		throw fail(400, { message: 'id is required on update project' });
	}
	const body: ProjectUpdate = await request.json();
	await service.updateProject(id, body);

	return json({ result: 'ok' });
};
export const DELETE: RequestHandler = async ({ params: { id }, locals: { service } }) => {
	if (!id) {
		throw fail(400, { message: 'id is required on delete project' });
	}
	await service.deleteProject(id);

	return json({ result: 'ok' });
};
