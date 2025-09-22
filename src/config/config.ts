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
    index: process.env.ELASTICSEARCH_INDEX || 'ui-backend-logs',
    enabled: process.env.ELASTICSEARCH_LOGGING_ENABLED === 'true'
  }
};
