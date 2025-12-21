import type { NextFunction, Request, Response } from "express";
import { HTTP_CODES, type HttpCode } from "../constants/httpCodes.js";
import logger from "../logger.js";
import type { AppError } from "../utils/AppError.js";

export const globalErrorHandler = (
	err: Error | AppError,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	let statusCode: HttpCode = HTTP_CODES.INTERNAL_SERVER_ERROR;
	let message = "Internal Server Error";

	// Check if it's our custom AppError
	if ("statusCode" in err) {
		statusCode = (err as AppError).statusCode;
		message = err.message;
	} else {
		// If it's not a custom error, it's likely a crash or unhandled exception
		// Log the full stack trace for debugging
		logger.error(err);
	}

	res.status(statusCode).json({
		success: false,
		message,
		// Only show stack trace in non-production environments
		...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
	});
};
