import createClient from './base';
import type { Fetch } from './base';
import project from './project';

export function buildApi(_fetch: Fetch = fetch) {
	const client = createClient(_fetch);
	return {
		project: project(client)
	};
}

const api = buildApi();

export type API = ReturnType<typeof buildApi>;

export default api;
