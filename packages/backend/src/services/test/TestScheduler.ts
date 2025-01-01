import { Feature, Test, AuditLog } from '../../models';
import { AnalyticsService } from '../integrations/AnalyticsService';

export class TestScheduler {
  private analytics: AnalyticsService;

  constructor() {
    this.analytics = new AnalyticsService();
  }

  async scheduleTest(featureId: string, config: any) {
    const test = await Test.create({
      feature: featureId,
      ...config,
      status: 'scheduled'
    });

    await this.scheduleTestPhases(test.id);
  }

  private async scheduleTestPhases(testId: string) {
    const test = await Test.findById(testId);
    const phases = this.calculateTestPhases(test);
    
    // Schedule phase transitions
    phases.forEach(phase => {
      setTimeout(
        () => this.transitionPhase(testId, phase),
        phase.startTime - Date.now()
      );
    });
  }

  private calculateTestPhases(test: any) {
    const startTime = new Date(test.startDate).getTime();
    const phaseDuration = Math.floor(
      (new Date(test.endDate).getTime() - startTime) / 3
    );

    return [
      { name: 'ramp_up', startTime },
      { name: 'full_run', startTime + phaseDuration },
      { name: 'analysis', startTime + 2 * phaseDuration }
    ];
  }

  private async transitionPhase(testId: string, phase: any) {
    await Test.findByIdAndUpdate(testId, { status: phase.name });
    
    if (phase.name === 'analysis') {
      const metrics = await this.analytics.getTestMetrics(testId);
      await this.concludeTest(testId, metrics);
    }
  }

  private async concludeTest(testId: string, metrics: any) {
    const test = await Test.findByIdAndUpdate(
      testId,
      { 
        status: 'completed',
        results: metrics
      },
      { new: true }
    );

    await AuditLog.create({
      action: 'test_completed',
      target: { type: 'test', id: testId },
      metadata: { metrics }
    });
  }
}