import React, { useState, useEffect } from 'react';
import { getUsageAnalytics } from '../../api/analytics';
import { UsageChart } from './UsageChart';
import { MetricCards } from './MetricCards';
import { FeatureBreakdown } from './FeatureBreakdown';
import { DateRangePicker } from '../ui/DateRangePicker';

export const UsageDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    const analytics = await getUsageAnalytics(dateRange);
    setData(analytics);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usage Analytics</h2>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <MetricCards metrics={data?.summary} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsageChart data={data?.timeSeriesData} />
        <FeatureBreakdown data={data?.featureUsage} />
      </div>
    </div>
  );
};