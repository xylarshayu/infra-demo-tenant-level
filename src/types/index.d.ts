export interface IPaginationResponse {
	page: number;
	limit: number;
	total: number;
	pages: number;
}

export type ResponseType = "success-regular" | "success-paginated" | "error";

type SuccessRegularResponse<T> = {
	success: true;
	data: T;
	pagination?: never;
	message?: never;
	stack?: never;
};

type SuccessPaginatedResponse<T> = {
	success: true;
	data: T;
	pagination: IPaginationResponse;
	message?: never;
	stack?: never;
};

type ErrorResponse = {
	success: false;
	data?: never;
	pagination?: never;
	message: string;
	stack?: string;
};

export type IApiResponse<
	T = null,
	R extends ResponseType = "success-regular",
> = R extends "success-regular"
	? SuccessRegularResponse<T>
	: R extends "success-paginated"
		? SuccessPaginatedResponse<T>
		: R extends "error"
			? ErrorResponse
			: never;

export type IServerHealth = {
	status: "UP" | null;
	uptime: number | null;
	timestamp: string | null;
};
