import client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Feature usage metrics
export const featureUsageCounter = new client.Counter({
  name: 'feature_usage_total',
  help: 'Total number of feature usages',
  labelNames: ['feature', 'team']
});

export const featureLatencyHistogram = new client.Histogram({
  name: 'feature_latency_seconds',
  help: 'Feature usage latency in seconds',
  labelNames: ['feature'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

export const quotaUsageGauge = new client.Gauge({
  name: 'feature_quota_usage',
  help: 'Current feature quota usage percentage',
  labelNames: ['feature', 'team']
});

register.registerMetric(featureUsageCounter);
register.registerMetric(featureLatencyHistogram);
register.registerMetric(quotaUsageGauge);

export { register };