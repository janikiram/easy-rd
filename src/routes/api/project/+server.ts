import type { ProjectCreate } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals: { service }, request }) => {
	const body: ProjectCreate = await request.json();
	const result = await service.createProject(body);

	return json(result);
};
