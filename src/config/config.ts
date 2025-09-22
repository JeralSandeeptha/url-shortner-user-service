import { loadEnv } from './env.ts';

// loading the environment variables before set to config object
loadEnv();

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : '',
  databaseUrl: process.env.DATABASE_URL || '',
  env: process.env.NODE_ENV || '',
  corsOrigin: process.env.CORS_ORIGIN ?? '*'
};
