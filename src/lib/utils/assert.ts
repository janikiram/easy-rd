export function assert(condition: boolean, msg: string): asserts condition {
	if (!condition) {
		throw new Error(msg);
	}
}

export function assertUnreachable(x: never, msg: string): never {
	throw new Error(msg);
}
