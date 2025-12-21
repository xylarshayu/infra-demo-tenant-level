import type { Request } from "express";
import { Agent } from "undici";
import type { IApiResponse, ResponseType } from "../../types/index.js";

const sharedAgent = new Agent({
	keepAliveTimeout: 10000,
	keepAliveMaxTimeout: 30000,
	connections: 50,
});

type FetchOptions = RequestInit & {
	query?: Request["query"];
};

export const createClient = (
	baseUrl: string,
	defaultHeaders: Record<string, string> = {},
) => {
	const cleanedBaseUrl = baseUrl.replace(/\/$/, ""); // no trailing slash

	return async <T = null, R extends ResponseType = "success-regular">(
		path: string,
		options: FetchOptions = {},
	): Promise<IApiResponse<T, R>> => {
		const { query, ...initRequest } = options;

		const url = new URL(`${cleanedBaseUrl}${path}`);
		if (query) {
			Object.entries(query).forEach(([key, value]) => {
				if (value === undefined || value === null) return;

				if (Array.isArray(value)) {
					value.forEach((v) => {
						url.searchParams.append(key, String(v));
					});
				} else {
					url.searchParams.append(key, String(value));
				}
			});
		}

		const headers = new Headers(options.headers || {});
		Object.entries(defaultHeaders).forEach(([k, v]) => {
			headers.set(k, v);
		});

		let body = options.body;
		if (body && typeof body === "object" && !headers.has("Content-Type")) {
			headers.set("Content-Type", "application/json");
			body = JSON.stringify(body);
		}

		const response = await fetch(url.toString(), {
			...initRequest,
			headers,
			body,
			// @ts-expect-error - TS sometimes fights with undici types in global fetch
			dispatcher: sharedAgent,
		});

		if (response.status === 204) {
			return {
				success: true,
				data: {} as T,
			} as unknown as IApiResponse<T, R>;
		}

		const rawBody = await response.json().catch(() => null);

		// Handle HTTP Errors (4xx, 5xx)
		if (!response.ok) {
			// If the API returned a structured JSON error matching your interface
			if (rawBody && typeof rawBody === "object" && rawBody.success === false) {
				return rawBody as IApiResponse<T, R>; // Return it so you can check !res.success
			}

			// If it's a random error (e.g. Nginx HTML 502), throw normally
			const errorText = rawBody ? JSON.stringify(rawBody) : response.statusText;
			throw new Error(`[${response.status}] ${url}: ${errorText}`);
		}

		// Handle Success
		return rawBody as IApiResponse<T, R>;
	};
};

export const closeHttpConnections = async () => {
	await sharedAgent.close();
};
