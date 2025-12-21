import type { HttpCode } from "../constants/httpCodes.js";

export interface AppError extends Error {
	statusCode: HttpCode;
	isOperational: boolean; // Distinguish between operational and programming errors
}

export const createAppError = (
	message: string,
	statusCode: HttpCode,
): AppError => {
	const error = new Error(message) as AppError;
	error.statusCode = statusCode;
	error.isOperational = true;

	Error.captureStackTrace(error, createAppError);

	return error;
};
