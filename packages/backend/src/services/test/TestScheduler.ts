import { Feature, Test, AuditLog } from '../../models';
import { AnalyticsService } from '../integrations/AnalyticsService';

export class TestScheduler {
  private analytics: AnalyticsService;

  constructor() {
    this.analytics = new AnalyticsService();
  }

  async scheduleTest(featureId: string, config: any) {
    try {
      const test = await Test.create({
        feature: featureId,
        ...config,
        status: 'scheduled'
      });

      await this.scheduleTestPhases(test.id);
    } catch (error) {
      console.error('Error scheduling test:', error);
      // Optionally log or handle the error
    }
  }

  private async scheduleTestPhases(testId: string) {
    try {
      const test = await Test.findById(testId);
      if (!test) return;

      const phases = this.calculateTestPhases(test);
      
      // Schedule phase transitions
      phases.forEach(phase => {
        setTimeout(
          () => this.transitionPhase(testId, phase),
          Math.max(0, phase.startTime - Date.now())
        );
      });
    } catch (error) {
      console.error('Error in scheduleTestPhases:', error);
    }
  }

  private calculateTestPhases(test: any) {
    const startTime = new Date(test.startDate).getTime();
    const endTime = new Date(test.endDate).getTime();
    const phaseDuration = Math.floor((endTime - startTime) / 3);

    return [
      { 
        name: 'ramp_up', 
        startTime: startTime 
      },
      { 
        name: 'full_run', 
        startTime: startTime + phaseDuration 
      },
      { 
        name: 'analysis', 
        startTime: startTime + 2 * phaseDuration 
      }
    ];
  }

  private async transitionPhase(testId: string, phase: any) {
    try {
      await Test.findByIdAndUpdate(testId, { status: phase.name });
      
      if (phase.name === 'analysis') {
        const metrics = await this.analytics.getTestMetrics(testId);
        await this.concludeTest(testId, metrics);
      }
    } catch (error) {
      console.error('Error in transitionPhase:', error);
    }
  }

  private async concludeTest(testId: string, metrics: any) {
    try {
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
    } catch (error) {
      console.error('Error concluding test:', error);
    }
  }
}