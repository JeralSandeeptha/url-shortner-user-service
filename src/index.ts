import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import compression from 'compression';

const app = express();

// Middleware
app.use(compression());
app.use(cors({
    credentials: true,
}));
app.use(cookieParser());

// body parsing
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

const server = http.createServer(app);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
