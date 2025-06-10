import type { Handle } from '@sveltejs/kit';
import { handle as auth } from '$lib/auth';
import { sequence } from '@sveltejs/kit/hooks';
import { createDatabaseHandler } from '$lib/server/database';
import { Service } from '$lib/server/service';
import { init } from '@jill64/sentry-sveltekit-cloudflare/server';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';

const databaseHandler = createDatabaseHandler();

const service: Handle = async ({ event, resolve }) => {
	const {
		locals: { db, getSession }
	} = event;

	event.locals.service = new Service({ db, getSession, origin: event.url.origin });
	return resolve(event);
};

const { onHandle, onError } = init(PUBLIC_SENTRY_DSN, { enableInDevMode: false });

export const handle = onHandle(sequence(auth, databaseHandler, service));

export const handleError = onError((_e, _sentryEventId) => {
	console.error(_e);
});
