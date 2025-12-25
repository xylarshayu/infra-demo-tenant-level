import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { closeHttpConnections } from "./clients/base/httpClient.js";
import logger from "./logger.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";
import { sensitiveDataFilter } from "./middleware/responseFilter.js";
import routes from "./routes/index.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

app.use(helmet());
app.use(cors());
app.use(pinoHttp({ logger }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Filter out data meant for internal microservices only eg database uri ---
app.use(sensitiveDataFilter); // <- Sensitive object properties must start with the prefix

app.use("/tenant-ser", routes);

// --- (Note: Must stay last) ---
app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
	logger.info(`Env is ${process.env.NODE_ENV}`);
	logger.info(`Tenant Server running on port ${PORT}`);
	logger.info(
		`Health check available at http://localhost:${PORT}/tenant-ser/health`,
	);
});

const gracefulShutdown = () => {
	logger.info("Received kill signal, shutting down gracefully");

	closeHttpConnections();

	server.close(() => {
		logger.info("Closed out remaining connections");
		process.exit(0);
	});

	setTimeout(() => {
		logger.error(
			"Could not close connections in time, forcefully shutting down",
		);
		process.exit(1);
	}, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
