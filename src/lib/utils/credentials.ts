import type { Provider } from '@auth/core/providers';

import Github from '@auth/sveltekit/providers/github';
export function resolveOAuthCredentials(raw: string): Provider[] {
	const items = raw.split('|');
	return [..._resolveItems(items)];
}

function* _resolveItems(items: string[]) {
	for (const item of items) {
		if (item === '') continue;
		const [type, clientId, clientSecret] = item.split(':');
		if (type === 'github') {
			yield Github({ clientId, clientSecret });
		} else {
			console.error('Unknown provider type:', type);
		}
	}
}
