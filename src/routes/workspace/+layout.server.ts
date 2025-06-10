import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals: { service, getSession } }) => {
	const session = await getSession();
	if (session == null)
		return {
			projects: []
		};
	const projects = await service.findAllProjectsOfMember();
	return { projects };
}) satisfies LayoutServerLoad;
