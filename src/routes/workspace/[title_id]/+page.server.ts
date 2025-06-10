import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params: { title_id }, locals: { service }, parent }) => {
	const { seo = {} } = await parent();
	const id = extractId(title_id);
	if (id == null) throw fail(400, { message: 'Invalid project id' });

	const [project, projects] = await Promise.all([
		service.findProject(id),
		service.findAllProjectsOfMember()
	]);

	return {
		project,
		projects,
		seo: {
			...seo,
			title: `${project.name || 'Untitled'} - easy-rd.dev`
		}
	};
}) satisfies PageServerLoad;

function extractId(title_id: string) {
	// UUID 패턴에 맞는 정규 표현식
	const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
	const match = title_id.match(uuidPattern); // title_id에서 UUID 패턴을 검색

	return match?.[0];
}
