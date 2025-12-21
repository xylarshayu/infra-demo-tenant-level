import { z } from "zod";

const envSchema = z.object({
	PORT: z.string().transform(Number).default(4001),
	SOME_SECRET_VALUE: z.string(),
	MASTER_BASE_URL: z.url(),
	INTERNAL_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
