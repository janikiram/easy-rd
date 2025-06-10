import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export default function writableOnlyClient<T>(initialValue: T) {
	const { subscribe, set: _set, update: _update } = writable(initialValue);

	const set = (value: T) => {
		if (browser) {
			_set(value);
		}
	};

	const update = (callback: (value: T) => T) => {
		if (browser) {
			_update(callback);
		}
	};

	return { subscribe, set, update };
}
