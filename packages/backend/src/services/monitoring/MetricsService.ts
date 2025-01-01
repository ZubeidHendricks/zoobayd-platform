import { quotaUsageGauge } from '../../metrics';
import { Team, Feature } from '../../models';

export class MetricsService {
  async updateQuotaMetrics() {
    const teams = await Team.find().populate('features');

    for (const team of teams) {
      for (const feature of team.features) {
        const usage = await this.calculateQuotaUsage(team.id, feature.id);
        quotaUsageGauge.set(
          { feature: feature.id, team: team.id },
          usage
        );
      }
    }
  }

  private async calculateQuotaUsage(teamId: string, featureId: string): Promise<number> {
    const feature = await Feature.findById(featureId);
    const quota = feature.quotas.get(teamId);
    const usage = feature.usage.get(teamId) || 0;
    
    return quota ? (usage / quota) * 100 : 0;
  }
}