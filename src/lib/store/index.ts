import { getContext, setContext } from 'svelte';
import type { Member } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

export * from './workspace';

const USER_KEY = Symbol('user');

export function initUserContext(user: Member | null | undefined) {
	setContext(USER_KEY, writable(user));
}

export function getUserContext(): Writable<Member | null> {
	return getContext(USER_KEY);
}
