import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();
	if (session !== null) {
		redirect(307, '/');
	}
	return {
		session
	};
};
