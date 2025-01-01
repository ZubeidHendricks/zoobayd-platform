import Stripe from 'stripe';
import { UsageMetrics, Team } from '../../models';

export class BillingManager {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16'
    });
  }

  async trackUsage(teamId: string, featureId: string, usage: number): Promise<void> {
    const team = await Team.findById(teamId).populate('subscription');
    const subscriptionId = team?.subscription?.stripeSubscriptionId;

    if (subscriptionId) {
      await this.stripe.subscriptionItems.createUsageRecord(
        subscriptionId,
        { quantity: usage, timestamp: Math.floor(Date.now() / 1000) }
      );
    }
  }

  async calculateBill(teamId: string, period: { start: Date; end: Date }): Promise<number> {
    const usage = await UsageMetrics.aggregate([
      { $match: { team: teamId, timestamp: { $gte: period.start, $lte: period.end } } },
      { $group: { _id: '$feature', total: { $sum: '$billing.cost' } } }
    ]);

    return usage.reduce((sum, { total }) => sum + total, 0);
  }

  async updateQuota(teamId: string, newQuota: Record<string, number>): Promise<void> {
    await Team.findByIdAndUpdate(teamId, {
      'subscription.customLimits': newQuota
    });
  }
}