import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';

export const createSampler = () => {
  return new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(0.5),
  });
};

export const shouldSampleOperation = (operationName: string): boolean => {
  const criticalOperations = [
    'feature.access_check',
    'feature.quota_check',
    'error'
  ];

  if (criticalOperations.includes(operationName)) {
    return true;
  }

  const mlOperations = [
    'feature.ml_prediction',
    'model.train',
    'model.predict'
  ];

  if (mlOperations.includes(operationName)) {
    return Math.random() < 0.1; // Sample 10% of ML operations
  }

  return Math.random() < 0.5; // Default 50% sampling
};