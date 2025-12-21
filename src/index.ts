import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import logger from './logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Security Middleware (Helmet)
app.use(helmet());

// 2. CORS
app.use(cors());

// 4. Logging Middleware (Pino)
app.use(pinoHttp({ logger }));

// 5. Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Tenant Service!');
});

// --- SERVER STARTUP & GRACEFUL SHUTDOWN ---
const server = app.listen(PORT, () => {
  logger.info(`Env is ${process.env.NODE_ENV}`);
  logger.info(`Tenant Server running on port ${PORT}`);
  logger.info(`Health check available at http://localhost:${PORT}/health`);
});

const gracefulShutdown = () => {
  logger.info('Received kill signal, shutting down gracefully');
  server.close(() => {
    logger.info('Closed out remaining connections');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
