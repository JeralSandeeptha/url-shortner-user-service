import { loadEnv } from './env.ts';

// loading the environment variables before set to config object
loadEnv();

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : '',
  databaseUrl: process.env.DATABASE_URL || '',
  env: process.env.NODE_ENV || '',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  elasticsearch: {
    host: process.env.ELASTICSEARCH_HOST || 'http://localhost:9200',
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'admin1234',
    index: process.env.ELASTICSEARCH_INDEX || 'user-service-logs',
    enabled: process.env.ELASTICSEARCH_LOGGING_ENABLED === 'true'
  },
  apm: {
    enabled: process.env.APM_ENABLED === 'true',
    serverUrl: process.env.APM_SERVER_URL || 'http://localhost:8200',
    serviceName: process.env.APM_SERVICE_NAME || 'user-service',
    serviceVersion: process.env.APM_SERVICE_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    secretToken: process.env.APM_SECRET_TOKEN || '',
    captureBody: process.env.APM_CAPTURE_BODY === 'true',
    captureHeaders: process.env.APM_CAPTURE_HEADERS === 'true',
    logLevel: process.env.APM_LOG_LEVEL || 'info'
  }
};
