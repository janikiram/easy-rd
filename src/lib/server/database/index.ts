import type { DatabaseAdapter } from './types';
import { DrizzleAdapter } from './drizzle-adapter';
import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { drizzle as generateDrizzle } from 'drizzle-orm/d1';

export type { DatabaseAdapter } from './types';
export { DrizzleAdapter } from './drizzle-adapter';

/**
 * Create database adapter middleware for SvelteKit.
 * This middleware initializes the database adapter and makes it available in locals.
 * 
 * By default, it uses Drizzle ORM with Cloudflare D1.
 * You can replace this with your own database adapter implementation.
 */
export function createDatabaseHandler(): Handle {
	return function ({ event, resolve }) {
		// Skip processing if building
		if (building) return resolve(event);

		// Default implementation using Drizzle with Cloudflare D1
		const { platform } = event;
		if (platform === undefined) {
			console.error('platform is undefined');
			throw new Error('platform is undefined');
		}
		
		const db = generateDrizzle(platform.env.DB);
		event.locals.dbAdapter = new DrizzleAdapter(db);
		
		// Keep the original db for backward compatibility
		// This can be removed once all code is migrated to use dbAdapter
		event.locals.db = db;
		
		return resolve(event);
	};
}

/**
 * Alternative database handler examples.
 * Uncomment and modify one of these to use a different database.
 */

/* Example: PostgreSQL with Drizzle
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

export function createDatabaseHandler(): Handle {
	return function ({ event, resolve }) {
		if (building) return resolve(event);
		
		const sql = neon(process.env.DATABASE_URL!);
		const db = drizzle(sql);
		event.locals.dbAdapter = new DrizzleAdapter(db);
		
		return resolve(event);
	};
}
*/

/* Example: Custom ORM Implementation
import { PrismaAdapter } from './prisma-adapter';
import { PrismaClient } from '@prisma/client';

export function createDatabaseHandler(): Handle {
	const prisma = new PrismaClient();
	
	return function ({ event, resolve }) {
		if (building) return resolve(event);
		
		event.locals.dbAdapter = new PrismaAdapter(prisma);
		
		return resolve(event);
	};
}
*/