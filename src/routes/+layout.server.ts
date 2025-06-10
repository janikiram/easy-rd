import type { Member } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals: { getSession }, url: { origin } }) => {
	const session = await getSession();
	const user = session?.user;
	/**
	 * TODO: 소셜 로그인이 추가되거나 member setting을 수정할 수 있으면
	 * service.findMember()을 구현하고 해당 반환값을 활용할 것.
	 */
	return {
		user:
			user &&
			({
				id: user.id,
				name: user.name ?? '',
				email: user.email ?? '',
				image: user.image ?? ''
			} satisfies Member),
		seo: {
			title: 'easy-rd.dev',
			description: 'Create, collaborate, and export your Entity-Relation.',
			images: [
				{
					url: `${origin}/easy-rd.png`,
					width: 800,
					height: 600,
					alt: 'easy-rd.dev logo'
				}
			]
		}
	};
}) satisfies LayoutServerLoad;
