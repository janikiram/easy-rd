import type { ResourceAdapter } from './types';
import { DrizzleAdapter } from './drizzle-adapter';
import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';

export type { ResourceAdapter, AdapterConfig } from './types';
export { DrizzleAdapter } from './drizzle-adapter';

/**
 * Create resource adapter middleware for SvelteKit.
 * This middleware initializes the resource adapter and makes it available in locals.
 * 
 * By default, it creates a DrizzleAdapter that handles D1 connection internally.
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
			// DrizzleAdapter will handle DB connection internally
			event.locals.dbAdapter = DrizzleAdapter.fromPlatform(event.platform);
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