import { env } from "../config/env.js";
import { createClient } from "./base/httpClient.js";

export const masterClient = createClient(`${env.MASTER_BASE_URL}/master-ser`, {
	"x-internal-api-key": env.INTERNAL_API_KEY,
});
