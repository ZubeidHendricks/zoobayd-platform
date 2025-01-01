import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';

export class ExporterManager {
  private exporters: Map<string, any> = new Map();

  constructor() {
    this.initializeExporters();
  }

  private initializeExporters() {
    // Console exporter for development
    if (process.env.NODE_ENV !== 'production') {
      this.exporters.set('console', new ConsoleSpanExporter());
    }

    // Jaeger exporter
    this.exporters.set('jaeger', new JaegerExporter({
      endpoint: process.env.JAEGER_ENDPOINT,
      username: process.env.JAEGER_USERNAME,
      password: process.env.JAEGER_PASSWORD
    }));

    // OTLP exporter for cloud providers
    if (process.env.OTLP_ENDPOINT) {
      this.exporters.set('otlp', new OTLPTraceExporter({
        url: process.env.OTLP_ENDPOINT,
        headers: {
          'Authorization': process.env.OTLP_AUTH_HEADER || ''
        }
      }));
    }

    // Zipkin exporter for compatibility
    if (process.env.ZIPKIN_ENDPOINT) {
      this.exporters.set('zipkin', new ZipkinExporter({
        url: process.env.ZIPKIN_ENDPOINT
      }));
    }
  }

  getExporter(name: string) {
    return this.exporters.get(name);
  }

  getAllExporters() {
    return Array.from(this.exporters.values());
  }
}