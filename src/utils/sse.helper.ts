import type { RequestHandler, Response } from "express";

/**
 * Interface for the mock SSE response object that intercepts standard Express response methods
 * and converts them to SSE-formatted data instead of closing the connection.
 */
interface SseMockResponse {
	status(code: number): SseMockResponse;
	send(body?: unknown): SseMockResponse;
	json(body: unknown): SseMockResponse;
	end(): SseMockResponse;
}

/**
 * Creates a type-safe mock response object that intercepts standard Express response methods
 * and converts them to SSE-formatted data instead of closing the connection.
 */
function createSseMockResponse(realRes: Response): SseMockResponse {
	return {
		status(): SseMockResponse {
			return this;
		},
		send(body?: unknown): SseMockResponse {
			if (body !== undefined) {
				const data = typeof body === "string" ? body : JSON.stringify(body);
				realRes.write(`data: ${data}\n\n`);
			}
			return this;
		},
		json(body: unknown): SseMockResponse {
			realRes.write(`data: ${JSON.stringify(body)}\n\n`);
			return this;
		},
		end(): SseMockResponse {
			return this;
		},
	};
}

/**
 * SSE (Server-Sent Events) streamify function
 *
 * Wraps an Express request handler to create a streaming SSE connection that:
 * - Sets appropriate SSE headers
 * - Runs the controller immediately and then on a specified interval
 * - Converts .status(), .json(), and .send() calls to SSE formatted data
 * - Cleans up the interval when the client disconnects
 *
 * @param controller - The Express request handler to wrap (receives mock response for streaming)
 * @param interval - The interval in milliseconds between each controller execution
 * @returns A new request handler that manages the SSE stream
 *
 * @example
 * ```typescript
 * router.get("/sse/events", streamify(eventsController, 5000));
 * ```
 */
export const streamify = (
	controller: RequestHandler,
	interval: number = 500,
): RequestHandler => {
	return (req, res, next) => {
		// Set SSE headers
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering
		res.flushHeaders(); // Ensure headers are sent to client immediately

		// Create the mock response object
		const mockRes = createSseMockResponse(res);

		const runCallback = async () => {
			// Stop if client disconnected
			if (res.writableEnded || res.destroyed) return;

			try {
				await controller(req, mockRes as unknown as Response, next);
			} catch (err) {
				// If controller fails, decide if you want to close stream or just log
				console.error("SSE Controller Error:", err);
				// Optional: Send error event to frontend
				// res.write(`event: error\ndata: "Internal Server Error"\n\n`);
			}
		};

		runCallback();

		// Set up the interval for repeated execution
		const intervalId = setInterval(runCallback, interval);

		// Clean up
		const cleanUp = () => {
			clearInterval(intervalId);
			if (!res.writableEnded) res.end();
		};

		// Clean up the interval when the client disconnects
		req.on("close", cleanUp);

		req.on("error", cleanUp);
	};
};
