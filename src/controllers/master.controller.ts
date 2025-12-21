import type { NextFunction, Request, Response } from "express";
import { HTTP_CODES } from "../constants/httpCodes.js";
import { getAllTenants, getTenant } from "../services/masterService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllTenantsController = asyncHandler(
	async (req: Request, res: Response, _next: NextFunction) => {
		const result = await getAllTenants(req.query);
		res.status(HTTP_CODES.OK).json({
			success: true,
			data: result,
		});
	},
);

export const getTenantController = asyncHandler(
	async (req: Request, res: Response, _next: NextFunction) => {
		const result = await getTenant(req.params.tenantId, req.query);
		res.status(HTTP_CODES.OK).json({
			success: true,
			data: result,
		});
	},
);
