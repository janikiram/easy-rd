import type { Handle } from "@sveltejs/kit";
import { handle as auth } from "$lib/auth";
import { sequence } from "@sveltejs/kit/hooks";
import { createAdapterHandler } from "$lib/server/adapter";
import { Service } from "$lib/server/service";
import { init } from "@jill64/sentry-sveltekit-cloudflare/server";
import { PUBLIC_SENTRY_DSN } from "$env/static/public";

const adapterHandler = createAdapterHandler();

const service: Handle = async ({ event, resolve }) => {
  const {
    locals: { dbAdapter, getSession },
  } = event;

  event.locals.service = new Service({
    resource: dbAdapter,
    getSession,
    origin: event.url.origin,
  });
  return resolve(event);
};

const { onHandle, onError } = init(PUBLIC_SENTRY_DSN, {
  enableInDevMode: false,
});

export const handle = onHandle(sequence(auth, adapterHandler, service));

export const handleError = onError((_e, _sentryEventId) => {
  console.error(_e);
});
