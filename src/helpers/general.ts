import type { Request } from "express";
import type { ParsedQuery } from "../types/index.js";

export const parseQuery = (
	req: Request,
	defaultFields: string[] = [],
): ParsedQuery => {
	const { fields, limit, page, sort, search, ...filters } = req.query;

	return {
		fields: fields?.length
			? String(fields)
					.split(",")
					.map((f) => f.trim())
			: defaultFields,
		filters: { isActive: true, ...filters } as Record<string, unknown>,
		page: page ? Number(page) : undefined,
		limit: limit ? Number(limit) : undefined,
		sort: sort ? String(sort) : undefined,
		search: search ? String(search) : undefined,
	};
};
