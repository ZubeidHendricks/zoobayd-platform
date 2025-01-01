import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { MongoDBInstrumentation } from '@opentelemetry/instrumentation-mongodb';
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis';

const jaegerExporter = new JaegerExporter({
  endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
});

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'zoobayd-backend',
  }),
  spanProcessor: new SimpleSpanProcessor(jaegerExporter),
  instrumentations: [
    new ExpressInstrumentation(),
    new MongoDBInstrumentation(),
    new RedisInstrumentation(),
  ],
});

export const initTracing = () => sdk.start();