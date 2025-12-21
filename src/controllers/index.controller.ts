import type { NextFunction, Request, Response } from "express";
import { masterClient } from "../clients/master.client.js";
import { HTTP_CODES } from "../constants/httpCodes.js";
import type { IServerHealth } from "../types/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const healthCheckController = asyncHandler(
	async (_req: Request, res: Response, _next: NextFunction) => {
		res.status(HTTP_CODES.OK).json({
			success: true,
			data: {
				status: "UP",
				uptime: process.uptime(),
				timestamp: new Date().toISOString(),
			},
		});
	},
);

export const isConnectedController = asyncHandler(
	async (_req: Request, res: Response, _next: NextFunction) => {
		const masterResponse = await masterClient<IServerHealth>("/health").catch(
			() => ({ data: { status: "DOWN", uptime: null, timestamp: null } }),
		);
		res.status(HTTP_CODES.OK).json({
			success: true,
			data: {
				masterService: masterResponse.data,
			},
		});
	},
);
