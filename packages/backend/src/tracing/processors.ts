import { BatchSpanProcessor, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export const createSpanProcessors = (serviceName: string) => {
  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SERVICE_VERSION || '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development'
  });

  // Development processor - immediate export
  const simpleProcessor = new SimpleSpanProcessor(
    new JaegerExporter({
      endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces'
    })
  );

  // Production processor - batched export
  const batchProcessor = new BatchSpanProcessor(
    new OTLPTraceExporter({
      url: process.env.OTLP_ENDPOINT || 'http://collector:4318/v1/traces',
      headers: {
        'Authorization': process.env.OTLP_AUTH_HEADER || ''
      }
    }),
    {
      maxQueueSize: 2048,
      maxExportBatchSize: 512,
      scheduledDelayMillis: 5000,
      exportTimeoutMillis: 30000
    }
  );

  return process.env.NODE_ENV === 'production' 
    ? [batchProcessor]
    : [simpleProcessor, batchProcessor];
};