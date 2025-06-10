import type { Session as OASession, DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
	interface Session extends OASession {
		user: {
			id: string;
		} & DefaultSession['user'];
	}
}
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: ReturnType<(typeof import('drizzle-orm/d1'))['drizzle']>; // Deprecated: Use dbAdapter instead
			dbAdapter: import('$lib/server/adapter').ResourceAdapter;
			service: import('$lib/server/service').Service;
		}
		// interface PageData {}
		interface Platform {
			env: {
				DB: D1Database;
			};
		}
	}
}

export {};
