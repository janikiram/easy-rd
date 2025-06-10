import { OAUTH_CREDENTIALS } from '$env/static/private';
import { resolveOAuthCredentials } from '$lib/utils';
import { SvelteKitAuth } from '@auth/sveltekit';

export const { handle, signIn, signOut } = SvelteKitAuth({
	trustHost: true,
	providers: resolveOAuthCredentials(OAUTH_CREDENTIALS),
	callbacks: {
		async session({ session, token }) {
			if (token.sub === undefined) {
				throw new Error('No sub in token');
			}
			return {
				...session,
				user: {
					...session.user,
					id: token.sub
				}
			};
		}
	},
	pages: { signIn: '/signin' }
});
