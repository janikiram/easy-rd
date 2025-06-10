import { sentryVitePlugin } from '@sentry/vite-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
	plugins: [
		mode === 'production' &&
			sentryVitePlugin({
				org: 'cozyblog',
				project: 'easyrd-web',
				authToken: process.env.SENTRY_AUTH_TOKEN
			}),
		sveltekit()
	].filter(Boolean),
	resolve: { alias: { $lib: '/src/lib' } },
	ssr: { noExternal: ['@jill64/sentry-sveltekit-cloudflare'] }
}));
