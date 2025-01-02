import { v4 as uuidv4 } from 'uuid';

interface PlatformMetric {
  id: string;
  metricType: 'contractGeneration' | 'deployment' | 'securityScan' | 'userActivity';
  timestamp: Date;
  details: Record<string, any>;
}

interface AnalyticsSummary {
  totalContractsGenerated: number;
  totalDeployments: number;
  securityScanResults: {
    passedScans: number;
    failedScans: number;
  };
  userActivityTrends: {
    dailyActiveUsers: number;
    peakUsageTime: Date;
  };
}

class PlatformAnalyticsService {
  private metrics: PlatformMetric[] = [];

  // Record a new platform metric
  recordMetric(
    metricType: PlatformMetric['metricType'], 
    details: Record<string, any>
  ): PlatformMetric {
    const metric: PlatformMetric = {
      id: uuidv4(),
      metricType,
      timestamp: new Date(),
      details
    };

    this.metrics.push(metric);
    return metric;
  }

  // Generate platform-wide analytics summary
  generateAnalyticsSummary(
    timeframe: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): AnalyticsSummary {
    const now = new Date();
    const filteredMetrics = this.filterMetricsByTimeframe(now, timeframe);

    return {
      totalContractsGenerated: this.countMetricsByType(filteredMetrics, 'contractGeneration'),
      totalDeployments: this.countMetricsByType(filteredMetrics, 'deployment'),
      securityScanResults: this.aggregateSecurityScanResults(filteredMetrics),
      userActivityTrends: this.calculateUserActivityTrends(filteredMetrics)
    };
  }

  // Filter metrics based on timeframe
  private filterMetricsByTimeframe(
    endDate: Date, 
    timeframe: 'daily' | 'weekly' | 'monthly'
  ): PlatformMetric[] {
    const timeframeMilliseconds = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000
    };

    return this.metrics.filter(metric => 
      endDate.getTime() - metric.timestamp.getTime() <= timeframeMilliseconds[timeframe]
    );
  }

  // Count metrics by type
  private countMetricsByType(
    metrics: PlatformMetric[], 
    type: PlatformMetric['metricType']
  ): number {
    return metrics.filter(metric => metric.metricType === type).length;
  }

  // Aggregate security scan results
  private aggregateSecurityScanResults(
    metrics: PlatformMetric[]
  ): AnalyticsSummary['securityScanResults'] {
    const securityMetrics = metrics.filter(m => m.metricType === 'securityScan');
    
    return {
      passedScans: securityMetrics.filter(m => m.details.passed).length,
      failedScans: securityMetrics.filter(m => !m.details.passed).length
    };
  }

  // Calculate user activity trends
  private calculateUserActivityTrends(
    metrics: PlatformMetric[]
  ): AnalyticsSummary['userActivityTrends'] {
    const userActivityMetrics = metrics.filter(m => m.metricType === 'userActivity');
    
    // Count daily active users
    const dailyActiveUsers = new Set(
      userActivityMetrics.map(m => m.details.userId)
    ).size;

    // Find peak usage time
    const peakUsageTime = this.findPeakUsageTime(userActivityMetrics);

    return {
      dailyActiveUsers,
      peakUsageTime
    };
  }

  // Determine peak usage time
  private findPeakUsageTime(metrics: PlatformMetric[]): Date {
    const hourlyUsage: { [hour: number]: number } = {};
    
    metrics.forEach(metric => {
      const hour = metric.timestamp.getHours();
      hourlyUsage[hour] = (hourlyUsage[hour] || 0) + 1;
    });

    const peakHour = Object.entries(hourlyUsage).reduce(
      (max, [hour, count]) => count > max.count ? { hour: parseInt(hour), count } : max, 
      { hour: 0, count: 0 }
    ).hour;

    const peakTime = new Date();
    peakTime.setHours(peakHour, 0, 0, 0);
    return peakTime;
  }
}

export default new PlatformAnalyticsService();