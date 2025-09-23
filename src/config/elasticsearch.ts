import { Client } from '@elastic/elasticsearch';
import { config } from './config.ts';
import { logger } from './logger.ts';

// Create Elasticsearch client for testing and index management
const elasticsearchClient = new Client({
  node: config.elasticsearch.host,
  auth: {
    username: config.elasticsearch.username,
    password: config.elasticsearch.password,
  },
  tls: {
    rejectUnauthorized: false, // For development only
  },
});

// Test Elasticsearch connection
export async function testElasticsearchConnection(): Promise<boolean> {
  try {
    const response = await elasticsearchClient.ping();
    console.log('✅ Elasticsearch connection successful');
    logger.info('Elasticsearch connection successful');
    return true;
  } catch (error) {
    console.error('❌ Elasticsearch connection failed:', error);
    logger.error('Elasticsearch connection failed', { error });
    return false;
  }
}

// Create index if it doesn't exist
export async function createLogIndex(): Promise<void> {
  try {
    const indexExists = await elasticsearchClient.indices.exists({
      index: config.elasticsearch.index,
    });

    if (!indexExists) {
      await elasticsearchClient.indices.create({
        index: config.elasticsearch.index,
        body: {
          mappings: {
            properties: {
              timestamp: { type: 'date' },
              level: { type: 'keyword' },
              message: { type: 'text' },
              service: { type: 'keyword' },
              environment: { type: 'keyword' },
              stack: { type: 'text' },
              meta: { type: 'object' },
            },
          },
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
          },
        },
      } as any);
      console.log(`✅ Created Elasticsearch index: ${config.elasticsearch.index}`);
      logger.info(`Created Elasticsearch index: ${config.elasticsearch.index}`);
    } else {
      console.log(`✅ Elasticsearch index already exists: ${config.elasticsearch.index}`);
      logger.info(`Elasticsearch index already exists: ${config.elasticsearch.index}`);
    }
  } catch (error) {
    console.error('❌ Failed to create Elasticsearch index:', error);
    logger.error('Failed to create Elasticsearch index', { error });
  }
}
