import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// Enable logging for troubleshooting
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

interface TracingConfig {
  serviceName?: string;
  endpoint?: string;
  headers?: Record<string, string>;
}

export async function initializeTracing(config: TracingConfig) {
  try {
    const resource = new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName || "zoobayd-platform",
    });

    const provider = new NodeTracerProvider({
      resource: resource
    });

    const collectorOptions = {
      url: config.endpoint,
      headers: config.headers || {}
    };

    const exporter = new OTLPTraceExporter(collectorOptions);
    const processor = new BatchSpanProcessor(exporter);

    // Type assertion to handle the version mismatch
    provider.addSpanProcessor(processor as any);
    provider.register();

    return provider;
  } catch (error) {
    console.error("Failed to initialize tracing:", error);
    // Return a no-op provider in case of failure
    return new NodeTracerProvider();
  }
}