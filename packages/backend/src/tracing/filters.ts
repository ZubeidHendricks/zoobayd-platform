import { Span, SpanKind } from '@opentelemetry/api';
import { SpanProcessor } from '@opentelemetry/sdk-trace-base';

export class FilteringSpanProcessor implements SpanProcessor {
  constructor(private delegate: SpanProcessor) {}

  forceFlush(): Promise<void> {
    return this.delegate.forceFlush();
  }

  shutdown(): Promise<void> {
    return this.delegate.shutdown();
  }

  onStart(span: Span): void {
    if (this.shouldProcess(span)) {
      this.delegate.onStart(span);
    }
  }

  onEnd(span: Span): void {
    if (this.shouldProcess(span)) {
      this.delegate.onEnd(span);
    }
  }

  private shouldProcess(span: Span): boolean {
    // Skip health check endpoints
    if (span.attributes['http.route'] === '/health') {
      return false;
    }

    // Skip short internal spans
    if (span.kind === SpanKind.INTERNAL && span.duration < 1) {
      return false;
    }

    // Always process errors
    if (span.status?.code === 2) { // Error status
      return true;
    }

    // Process based on operation type
    const operation = span.attributes['operation'];
    if (operation && typeof operation === 'string') {
      if (operation.startsWith('feature.')) {
        return true;
      }
      if (operation.startsWith('ml.')) {
        return span.duration > 100; // Only process ML ops longer than 100ms
      }
    }

    return true;
  }
}