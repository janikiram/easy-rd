export type Fetch = typeof fetch;
export type Client = ReturnType<typeof createClient>;

export default function createClient(
	fetch: Fetch,
	basePath?: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	headerResolver?: () => any
) {
	async function _request<T = unknown, R = unknown>(
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		body: T = {} as T
	): Promise<R> {
		const url = basePath ? new URL(path, basePath) : path;
		let bodyText;
		let headers = headerResolver ? headerResolver() : {};
		if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
			bodyText = JSON.stringify(body);
			headers = { ...headers, 'Content-Type': 'application/json' };
		}
		const init = {
			method,
			headers,
			body: bodyText
		};
		return await fetch(url, {
			...init
		}).then(async (res) => {
			if (!res.ok) {
				throw new Error(res.statusText);
			}

			try {
				return await res.json();
			} catch (e) {
				return {} as R;
			}
		});
	}
	function get<R = unknown>(path: string): Promise<R> {
		return _request(path, 'GET');
	}

	function post<T = unknown, R = unknown>(path: string, body: T): Promise<R> {
		return _request(path, 'POST', body);
	}

	function put<T = unknown, R = unknown>(path: string, body: T): Promise<R> {
		return _request(path, 'PUT', body);
	}
	function del<T = unknown, R = unknown>(path: string, body?: T): Promise<R> {
		return _request(path, 'DELETE', body);
	}

	return {
		get,
		post,
		put,
		del
	};
}
