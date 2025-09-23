import { initializeAPM, createAPMTransaction, createAPMSpan, captureAPMError, setAPMUserContext, addAPMLabels } from './config/apm.ts';
import { logger } from './config/logger.ts';

// Test APM functionality
const testAPM = async () => {
  logger.info('Starting APM test...');
  
  // Initialize APM
  const apmAgent = initializeAPM();
  
  if (!apmAgent) {
    logger.error('APM agent not initialized');
    return;
  }
  
  logger.info('APM agent initialized successfully');
  
  // Test custom transaction
  const transaction = createAPMTransaction('test-transaction', 'custom');
  if (transaction) {
    logger.info('Created custom transaction');
    
    // Test custom span
    const span = createAPMSpan('test-span', 'custom');
    if (span) {
      logger.info('Created custom span');
      
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 100));
      
      span.end();
      logger.info('Ended custom span');
    }
    
    transaction.end();
    logger.info('Ended custom transaction');
  }
  
  // Test user context
  setAPMUserContext('test-user-123', 'testuser', 'test@example.com');
  logger.info('Set user context');
  
  // Test custom labels
  addAPMLabels({
    test: 'apm-integration',
    environment: 'development'
  });
  logger.info('Added custom labels');
  
  // Test error capture
  try {
    throw new Error('Test error for APM');
  } catch (error) {
    captureAPMError(error as Error, { testContext: 'apm-test' });
    logger.info('Captured test error');
  }
  
  logger.info('APM test completed successfully');
};

// Run the test
testAPM().catch(error => {
  logger.error('APM test failed', { error: error.message, stack: error.stack });
  process.exit(1);
});
