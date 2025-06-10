import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { drizzle as generateDrizzle } from 'drizzle-orm/d1';

export function drizzle(): Handle {
	return function ({ event, resolve }) {
		// skip other processing if building
		if (building) return resolve(event);

		const { platform } = event;
		if (platform === undefined) {
			console.error('platform is undefined');
			throw new Error('platform is undefined');
		}
		event.locals.db = generateDrizzle(platform.env.DB);
		return resolve(event);
	};
}
