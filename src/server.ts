import { app } from './app.ts';
import http from 'http';
import { flushAPM } from './config/apm.ts';
import { logger } from './config/logger.ts';

// Create HTTP server
const server = http.createServer(app);

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    // Flush APM data before exiting
    try {
      await flushAPM();
      logger.info('APM data flushed successfully');
    } catch (error) {
      logger.error('Failed to flush APM data', { error });
    }
    
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export { server };
