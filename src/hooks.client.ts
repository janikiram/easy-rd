import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import { init } from '@jill64/sentry-sveltekit-cloudflare/client';

const onError = init(PUBLIC_SENTRY_DSN);

export const handleError = onError((_e, _sentryEventId) => {
	// Your Error Handler
});
