import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { service }, request }) => {
	await service.createMember();

	const url = new URL(request.url);
	const redirectUrl = url.searchParams.get('redirect') ?? '/workspace';
	redirect(303, redirectUrl);
};
