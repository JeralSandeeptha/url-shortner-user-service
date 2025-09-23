# APM (Application Performance Monitoring) Setup

This document describes how to set up and configure Elastic APM monitoring for the UI Backend application.

## Overview

The application now includes comprehensive APM monitoring using the Elastic APM Node.js agent. This provides:

- **Performance Monitoring**: Track request response times, database queries, and external API calls
- **Error Tracking**: Automatic capture and reporting of application errors
- **Distributed Tracing**: Track requests across different services
- **Custom Metrics**: Application-specific performance indicators

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```bash
# APM Configuration
APM_ENABLED=true
APM_SERVER_URL=http://localhost:8200
APM_SERVICE_NAME=ui-backend
APM_SERVICE_VERSION=1.0.0
APM_SECRET_TOKEN=
APM_CAPTURE_BODY=true
APM_CAPTURE_HEADERS=true
APM_LOG_LEVEL=info
```

### Configuration Options

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `APM_ENABLED` | Enable/disable APM monitoring | `false` | No |
| `APM_SERVER_URL` | APM Server endpoint | `http://localhost:8200` | Yes |
| `APM_SERVICE_NAME` | Service name in APM | `ui-backend` | Yes |
| `APM_SERVICE_VERSION` | Service version | `1.0.0` | Yes |
| `APM_SECRET_TOKEN` | Secret token for APM authentication | - | No |
| `APM_CAPTURE_BODY` | Capture request/response bodies | `false` | No |
| `APM_CAPTURE_HEADERS` | Capture request/response headers | `false` | No |
| `APM_LOG_LEVEL` | APM agent log level | `info` | No |

## Docker Setup

The APM server is already configured in the Docker Compose setup:

```yaml
apmServer:
  image: docker.elastic.co/apm/apm-server:8.12.2
  container_name: apm_server_container
  ports:
    - 8200:8200
  volumes:
    - ./apm-server.yml:/usr/share/apm-server/apm-server.yml:ro
  networks:
    - elastic
```

## Features

### 1. Automatic Request Tracking

All HTTP requests are automatically tracked with:
- Request/response times
- HTTP status codes
- Request paths and methods
- User agent and IP address

### 2. Error Monitoring

Errors are automatically captured with:
- Stack traces
- Request context
- Custom error metadata

### 3. Custom Context

The application sets custom context for each request:
- Request ID
- User agent
- IP address
- Endpoint labels

### 4. Graceful Shutdown

APM data is properly flushed during application shutdown to ensure no data loss.

## Usage in Code

### Creating Custom Transactions

```typescript
import { createAPMTransaction } from './config/apm.ts';

const transaction = createAPMTransaction('custom-operation', 'custom');
// ... perform operation
transaction?.end();
```

### Creating Custom Spans

```typescript
import { createAPMSpan } from './config/apm.ts';

const span = createAPMSpan('database-query', 'db');
// ... perform database operation
span?.end();
```

### Setting User Context

```typescript
import { setAPMUserContext } from './config/apm.ts';

setAPMUserContext('user123', 'john.doe', 'john@example.com');
```

### Capturing Custom Errors

```typescript
import { captureAPMError } from './config/apm.ts';

try {
  // ... risky operation
} catch (error) {
  captureAPMError(error, { customContext: 'value' });
}
```

### Adding Custom Labels

```typescript
import { addAPMLabels } from './config/apm.ts';

addAPMLabels({
  feature: 'user-management',
  operation: 'create-user'
});
```

## Monitoring Dashboard

Access the APM monitoring dashboard through Kibana:

1. Start the Docker services: `docker-compose up -d`
2. Open Kibana: http://localhost:5601
3. Navigate to "Observability" > "APM"
4. Select your service: `ui-backend`

## Troubleshooting

### APM Agent Not Starting

1. Check if `APM_ENABLED=true` is set
2. Verify `APM_SERVER_URL` is correct
3. Ensure APM server is running and accessible
4. Check application logs for APM initialization messages

### No Data in APM

1. Verify APM server is running: `curl http://localhost:8200`
2. Check APM server logs: `docker logs apm_server_container`
3. Ensure Elasticsearch is running and accessible
4. Check network connectivity between services

### Performance Impact

The APM agent has minimal performance impact:
- CPU overhead: < 1%
- Memory overhead: ~10-20MB
- Network overhead: Minimal (batched data transmission)

## Security Considerations

- Use `APM_SECRET_TOKEN` in production environments
- Consider disabling `APM_CAPTURE_BODY` for sensitive data
- Monitor APM server access logs
- Use HTTPS for APM server communication in production

## Production Deployment

For production deployment:

1. Set `APM_SECRET_TOKEN` for authentication
2. Use HTTPS for APM server communication
3. Configure appropriate log levels
4. Set up APM server clustering for high availability
5. Monitor APM server performance and storage usage
