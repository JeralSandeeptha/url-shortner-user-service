import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { config } from './config.ts';
import { createLogIndex } from './elasticsearch.ts';

const { createLogger, format, transports } = winston;

// Create transports array
const loggerTransports: winston.transport[] = [
  new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(({ level, message, timestamp, stack }) => {
        return stack ? `${timestamp} ${level}: ${message}\n${stack}` : `${timestamp} ${level}: ${message}`;
      })
    )
  }),
  new transports.File({ filename: 'logs/error.log', level: 'error' }),
  new transports.File({ filename: 'logs/combined.log' })
];

// Add Elasticsearch transport if enabled
if (config.elasticsearch.enabled) {
  const esTransport = new ElasticsearchTransport({
    clientOpts: {
      node: config.elasticsearch.host,
      auth: {
        username: config.elasticsearch.username,
        password: config.elasticsearch.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
    index: config.elasticsearch.index,
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json()
    ),
    transformer: (logData: any) => {
      return {
        '@timestamp': logData.timestamp,
        level: logData.level,
        message: logData.message,
        service: 'users_service',
        environment: config.env,
        stack: logData.stack,
        meta: logData.meta || {}
      };
    }
  });

  loggerTransports.push(esTransport);
}

export const logger = createLogger({
  level: 'info', // default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // include stack traces
    format.splat(),
    format.json() // output logs in JSON
  ),
  transports: loggerTransports
});

// Initialize Elasticsearch index if logging is enabled
if (config.elasticsearch.enabled) {
  createLogIndex().catch(console.error);
}
