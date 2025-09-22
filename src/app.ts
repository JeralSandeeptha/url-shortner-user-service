import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import healthCheckRoute from './routes/v1/healthCheck.route.ts';

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

// Custom Routes
app.use('/server', healthCheckRoute);

export { app };
