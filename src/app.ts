import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import healthCheckRoute from './routes/v1/healthCheck.route.ts';
import { logger } from './config/logger.ts';
import { getAPMAgent, captureAPMError, setAPMUserContext, setAPMCustomContext } from './config/apm.ts';

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

// APM middleware for request tracking
app.use((req, res, next) => {
  const apmAgent = getAPMAgent();
  
  if (apmAgent) {
    // Set custom context for the request
    setAPMCustomContext('request_id', req.headers['x-request-id'] || 'unknown');
    setAPMCustomContext('user_agent', req.get('User-Agent') || 'unknown');
    setAPMCustomContext('ip_address', req.ip || 'unknown');
    
    // Add labels for better filtering in APM
    apmAgent.addLabels({
      endpoint: req.path,
      method: req.method,
      user_agent: req.get('User-Agent') || 'unknown'
    });
  }
  
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  next();
});

// Custom Routes
app.use('/server', healthCheckRoute);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Log error
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  // Capture error in APM
  captureAPMError(err, {
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    requestId: req.headers['x-request-id']
  });
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

export { app };
