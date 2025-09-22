import { logger } from './config/logger.ts';
import { testElasticsearchConnection } from './config/elasticsearch.ts';

async function testLogging() {
  console.log('🧪 Testing Elasticsearch logging integration...\n');

  // Test Elasticsearch connection
  const isConnected = await testElasticsearchConnection();
  
  if (!isConnected) {
    console.log('❌ Elasticsearch connection failed. Please check your configuration.');
    return;
  }

  // Test different log levels
  logger.info('This is an info message for testing');
  logger.warn('This is a warning message for testing');
  logger.error('This is an error message for testing');
  
  // Test structured logging
  logger.info('User action performed', {
    userId: '12345',
    action: 'login',
    timestamp: new Date().toISOString()
  });

  // Test error with stack trace
  try {
    throw new Error('This is a test error for stack trace');
  } catch (error) {
    logger.error('Test error occurred', { error: error.message, stack: error.stack });
  }

  console.log('\n✅ Test logging completed! Check your Elasticsearch index and Kibana for the logs.');
  console.log('📊 Open Kibana at http://localhost:5601 to view the logs');
}

// Run the test
testLogging().catch(console.error);
