import type { ResourceAdapter } from './types';
import { DrizzleAdapter } from './drizzle-adapter';
import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { drizzle as generateDrizzle } from 'drizzle-orm/d1';

export type { ResourceAdapter, AdapterConfig } from './types';
export { DrizzleAdapter } from './drizzle-adapter';

/**
 * Create resource adapter middleware for SvelteKit.
 * This middleware initializes the resource adapter and makes it available in locals.
 * 
 * By default, it uses Drizzle ORM with Cloudflare D1.
 * You can replace this with your own adapter implementation.
 */
export function createAdapterHandler(adapter?: ResourceAdapter): Handle {
	return function ({ event, resolve }) {
		// Skip processing if building
		if (building) return resolve(event);

		if (adapter) {
			// Use provided adapter
			event.locals.dbAdapter = adapter;
		} else {
			// Default implementation using Drizzle with Cloudflare D1
			const { platform } = event;
			if (platform === undefined) {
				console.error('platform is undefined');
				throw new Error('platform is undefined');
			}
			
			const db = generateDrizzle(platform.env.DB);
			event.locals.dbAdapter = new DrizzleAdapter(db);
			
			// Keep the original db for backward compatibility
			// This can be removed once all code is migrated to use adapter
			event.locals.db = db;
		}
		
		return resolve(event);
	};
}

/**
 * Example implementations for different data sources
 */

/* Example: REST API Adapter
import { APIAdapter } from './api-adapter';

export function createAPIAdapterHandler(apiUrl: string, apiKey: string): Handle {
	const adapter = new APIAdapter({ apiUrl, apiKey });
	return createAdapterHandler(adapter);
}
*/

/* Example: GraphQL Adapter
import { GraphQLAdapter } from './graphql-adapter';

export function createGraphQLAdapterHandler(endpoint: string, token: string): Handle {
	const adapter = new GraphQLAdapter({ endpoint, token });
	return createAdapterHandler(adapter);
}
*/

/* Example: In-Memory Adapter for Testing
import { InMemoryAdapter } from './in-memory-adapter';

export function createTestAdapterHandler(): Handle {
	const adapter = new InMemoryAdapter();
	return createAdapterHandler(adapter);
}
*/