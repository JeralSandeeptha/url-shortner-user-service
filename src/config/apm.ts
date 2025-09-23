import apm from 'elastic-apm-node';
import { config } from './config.ts';
import { logger } from './logger.ts';

let apmAgent: any = null;

export const initializeAPM = () => {
  if (!config.apm.enabled) {
    logger.info('APM monitoring is disabled');
    return null;
  }

  try {
    apmAgent = apm.start({
      serviceName: config.apm.serviceName,
      serviceVersion: config.apm.serviceVersion,
      serverUrl: config.apm.serverUrl,
      environment: config.apm.environment,
      secretToken: config.apm.secretToken || undefined,
      captureBody: config.apm.captureBody ? 'all' : 'off',
      captureHeaders: config.apm.captureHeaders,
      logLevel: config.apm.logLevel as any,
      active: true,
      instrument: true,
      captureSpanStackTraces: true,
      stackTraceLimit: 50,
      captureExceptions: true,
      transactionSampleRate: 1.0
    });

    if (apmAgent) {
      apmAgent.addLabels({
        service: config.apm.serviceName,
        environment: config.apm.environment,
        version: config.apm.serviceVersion
      });
    }

    logger.info('APM agent initialized successfully', {
      serviceName: config.apm.serviceName,
      serverUrl: config.apm.serverUrl,
      environment: config.apm.environment
    });

    return apmAgent;
  } catch (error) {
    logger.error('Failed to initialize APM agent', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return null;
  }
};

export const getAPMAgent = () => apmAgent;

export const createAPMTransaction = (name: string, type: string = 'request') => {
  if (!apmAgent) return null;
  return apmAgent.startTransaction(name, type);
};

export const createAPMSpan = (name: string, type: string = 'custom') => {
  if (!apmAgent) return null;
  return apmAgent.startSpan(name, type);
};

export const setAPMUserContext = (userId: string, username?: string, email?: string) => {
  if (!apmAgent) return;
  apmAgent.setUserContext({
    id: userId,
    username,
    email
  });
};

export const setAPMCustomContext = (key: string, value: any) => {
  if (!apmAgent) return;
  apmAgent.setCustomContext({ [key]: value });
};

export const addAPMLabels = (labels: Record<string, string | number | boolean>) => {
  if (!apmAgent) return;
  apmAgent.addLabels(labels);
};

export const captureAPMError = (error: Error, context?: Record<string, any>) => {
  if (!apmAgent) return;
  apmAgent.captureError(error, context);
};

export const flushAPM = () => {
  if (!apmAgent) return Promise.resolve();
  return apmAgent.flush();
};
