import React from 'react';
import { LineChart, BarChart } from '../ui/Charts';
import { Card } from '../ui/Card';

export const TestMetrics: React.FC = () => {
  const conversionData = [
    { name: 'Variant A', value: 12.5 },
    { name: 'Variant B', value: 15.2 }
  ];

  const timeSeriesData = [
    { date: '2024-01-01', variantA: 10, variantB: 11 },
    { date: '2024-01-02', variantA: 11, variantB: 13 },
    { date: '2024-01-03', variantA: 12, variantB: 14 }
  ];

  return (
    <Card className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Conversion Rates</h3>
        <BarChart data={conversionData} />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Usage Over Time</h3>
        <LineChart data={timeSeriesData} />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Statistical Significance</h3>
        <div className="bg-green-50 p-3 rounded">
          <p className="text-green-700">95% confidence level reached</p>
          <p className="text-sm text-green-600">Variant B shows 21.6% improvement</p>
        </div>
      </div>
    </Card>
  );
};