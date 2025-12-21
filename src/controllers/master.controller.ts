import type { NextFunction, Request, Response } from "express";
import { HTTP_CODES } from "../constants/httpCodes.js";
import { getAllTenantService } from "../services/masterService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllTenantsController = asyncHandler(
	async (_req: Request, res: Response, _next: NextFunction) => {
		const result = await getAllTenantService();
		res.status(HTTP_CODES.OK).json({
			success: true,
			data: result,
		});
	},
);
