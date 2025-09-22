# Elasticsearch Logging Setup

This document explains how to configure Elasticsearch logging for the UI Backend application.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Elasticsearch Configuration
ELASTICSEARCH_HOST=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=admin1234
ELASTICSEARCH_INDEX=ui-backend-logs
ELASTICSEARCH_LOGGING_ENABLED=true
```

## Configuration Details

- **ELASTICSEARCH_HOST**: The Elasticsearch server URL (default: http://localhost:9200)
- **ELASTICSEARCH_USERNAME**: Elasticsearch username (default: elastic)
- **ELASTICSEARCH_PASSWORD**: Elasticsearch password (default: admin1234)
- **ELASTICSEARCH_INDEX**: The index name for storing logs (default: ui-backend-logs)
- **ELASTICSEARCH_LOGGING_ENABLED**: Enable/disable Elasticsearch logging (default: false)

## Starting the Services

1. Start Elasticsearch and Kibana using Docker Compose:
   ```bash
   cd env
   docker-compose up -d elasticsearch kibana
   ```

2. Wait for Elasticsearch to be ready (check http://localhost:9200)

3. Start your application:
   ```bash
   cd application/ui-backend
   npm run dev
   ```

## Viewing Logs in Kibana

1. Open Kibana at http://localhost:5601
2. Login with username: `elastic`, password: `admin1234`
3. Go to "Stack Management" > "Index Patterns"
4. Create an index pattern for `ui-backend-logs*`
5. Go to "Discover" to view your application logs

## Log Structure

Each log entry in Elasticsearch will have the following structure:

```json
{
  "@timestamp": "2024-01-01T12:00:00.000Z",
  "level": "info",
  "message": "Your log message",
  "service": "ui-backend",
  "environment": "development",
  "stack": "Error stack trace (if applicable)",
  "meta": {}
}
```

## Troubleshooting

- If Elasticsearch connection fails, check that the service is running and credentials are correct
- Ensure the Elasticsearch container is accessible from your application
- Check the application logs for any Elasticsearch-related errors
