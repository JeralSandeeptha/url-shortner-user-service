import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import compression from 'compression';
import { logger } from './config/logger.ts';
import { config } from './config/config.ts';

const app = express();

// Middleware
app.use(compression());
app.use(
  cors({
    credentials: true
  })
);
app.use(cookieParser());

// body parsing
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Create HTTP server
const server = http.createServer(app);

// Start server
const port = config.port ? Number(config.port) : 3000;
server.listen(port, () => {
  logger.info(`Server listening on http://localhost:${port}`);
});
