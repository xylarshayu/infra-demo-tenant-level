import type { NextFunction, Request, Response } from "express";

const INTERNAL_SECRET_HEADER = "x-internal-api-key";
const INTERNAL_SECRET_PREFIX = "__x_";

export const sensitiveDataFilter = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const originalJson = res.json;

	res.json = function (body) {
		const isInternalRequest =
			req.headers[INTERNAL_SECRET_HEADER] === process.env.INTERNAL_API_KEY;

		if (isInternalRequest) {
			return originalJson.call(this, body);
		}

		const replacer = (key: string, value: unknown) => {
			if (key.startsWith(INTERNAL_SECRET_PREFIX)) {
				return undefined;
			}
			return value;
		};

		const filteredBody = JSON.stringify(body, replacer);
		res.setHeader("Content-Type", "application/json");
		return res.send(filteredBody);
	};

	next();
};
