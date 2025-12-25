import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import logger from "./logger.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";
import { sensitiveDataFilter } from "./middleware/responseFilter.js";
import routes from "./routes/index.route.js";

/**
 * Creates and configures the Express application instance.
 * This function can be imported and used for testing without starting a server.
 */
export const createApp = () => {
	const app = express();

	app.set('trust proxy', true);

	app.use(helmet());
	app.use(cors());
	app.use(pinoHttp({ logger }));

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// --- Filter out data meant for internal microservices only eg database uri ---
  // --- Yes it's monkey patching
	app.use(sensitiveDataFilter); // <- Sensitive object properties must start with the prefix

	app.use("/tenant-ser", routes);

	// --- (Note: Must stay last) ---
	app.use(globalErrorHandler);

	return app;
};

// Export the configured app instance for direct use
const app = createApp();
export default app;