import type { Request } from "express";
import { masterClient } from "../clients/master.client.js";
import type { ITenant } from "../types/tenant.js";

export const getAllTenants = async (query: Request["query"]) => {
	const response = await masterClient<ITenant[]>("/tenants", { query });
	return response.data;
};

export const getTenant = async (tenantId: string, query: Request["query"]) => {
	const response = await masterClient<ITenant>(`/tenants/${tenantId}`, {
		query,
	});
	return response.data;
};
