import { Request, Response, NextFunction } from 'express';
import { featureLatencyHistogram, featureUsageCounter } from '../metrics';

export const trackMetrics = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const featureId = req.params.featureId;
    const teamId = req.user?.teamId;

    res.on('finish', () => {
      const duration = (Date.now() - startTime) / 1000;
      
      if (featureId) {
        featureLatencyHistogram.observe({ feature: featureId }, duration);
        featureUsageCounter.inc({ feature: featureId, team: teamId });
      }
    });

    next();
  };
};