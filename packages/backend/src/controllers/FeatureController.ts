import { Request, Response } from 'express';
import { MLService, AnalyticsService } from '../integrations';
import { Feature } from '../models';

export class FeatureController {
  private mlService = new MLService();
  private analyticsService = new AnalyticsService();

  async checkAccess(req: Request, res: Response) {
    const { featureId } = req.params;
    const userId = req.user.id;

    try {
      const prediction = await this.mlService.predictUserBehavior(userId);
      const feature = await Feature.findById(featureId);
      
      // Logic for access decision
      res.json({ hasAccess: true, prediction });
    } catch (error) {
      res.status(500).json({ error: 'Access check failed' });
    }
  }

  async trackUsage(req: Request, res: Response) {
    const { featureId } = req.params;
    const { metrics } = req.body;
    const userId = req.user.id;

    try {
      await this.analyticsService.trackFeatureUsage(userId, featureId, metrics);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to track usage' });
    }
  }

  async getMetrics(req: Request, res: Response) {
    const { featureId } = req.params;
    const { startDate, endDate } = req.query;

    try {
      const metrics = await this.analyticsService.getUsageMetrics(featureId, {
        start: new Date(startDate as string),
        end: new Date(endDate as string)
      });
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get metrics' });
    }
  }

  async createTest(req: Request, res: Response) {
    const { featureId } = req.params;
    const { config } = req.body;

    try {
      const test = await Feature.findByIdAndUpdate(featureId, {
        $push: { abTests: { config, status: 'active' } }
      }, { new: true });
      res.json(test);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create test' });
    }
  }
}