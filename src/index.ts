import { logger } from './config/logger.ts';
import { config } from './config/config.ts';
import { server } from './server.ts';

// Start server
const port = config.port ? Number(config.port) : 3000;
server.listen(port, () => {
  logger.info(`Server listening on http://localhost:${port}`);
});
