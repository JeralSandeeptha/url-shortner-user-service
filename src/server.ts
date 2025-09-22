import { app } from './app.ts';
import http from 'http';

// Create HTTP server
const server = http.createServer(app);

export { server };
