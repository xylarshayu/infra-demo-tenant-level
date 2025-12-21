import { masterClient } from "../clients/master.client.js";
import type { ITenant } from "../types/tenant.js";

export const getAllTenantService = async () => {
	const response = await masterClient<ITenant[]>("/tenants");
	return response.data;
};

export const getTenant = async (tenantId: string) => {
	const response = await masterClient<ITenant>(`/tenants/${tenantId}`);
	return response.data;
};
