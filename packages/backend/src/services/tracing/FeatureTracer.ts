import { trace, Span, SpanStatusCode } from '@opentelemetry/api';
import { Feature } from '../../models';

export class FeatureTracer {
  private tracer = trace.getTracer('feature-service');

  async traceFeatureAccess(featureId: string, userId: string): Promise<Span> {
    const span = this.tracer.startSpan('feature.access_check');
    
    span.setAttributes({
      'feature.id': featureId,
      'user.id': userId
    });

    return span;
  }

  async traceQuotaUsage(featureId: string, teamId: string, usage: number, quota: number) {
    const span = this.tracer.startSpan('feature.quota_check');
    
    try {
      span.setAttributes({
        'feature.id': featureId,
        'team.id': teamId,
        'quota.usage': usage,
        'quota.limit': quota,
        'quota.percentage': (usage / quota) * 100
      });

      if (usage > quota) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: 'Quota exceeded'
        });
      }
    } finally {
      span.end();
    }
  }

  async traceMLPrediction(featureId: string, userId: string, predictionTime: number) {
    const span = this.tracer.startSpan('feature.ml_prediction');
    
    try {
      span.setAttributes({
        'feature.id': featureId,
        'user.id': userId,
        'prediction.duration_ms': predictionTime
      });
    } finally {
      span.end();
    }
  }

  async traceABTest(testId: string, featureId: string, variant: string) {
    const span = this.tracer.startSpan('feature.ab_test');
    
    try {
      span.setAttributes({
        'test.id': testId,
        'feature.id': featureId,
        'test.variant': variant
      });
    } finally {
      span.end();
    }
  }
}