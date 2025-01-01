import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';

interface Props {
  data: {
    feature: string;
    metrics: {
      usage: number;
      users: number;
      duration: number;
    };
  }[];
}

export const FeatureBreakdown: React.FC<Props> = ({ data }) => {
  const [metric, setMetric] = useState('usage');
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#84cc16'];

  const chartData = data?.map(item => ({
    name: item.feature,
    value: item.metrics[metric]
  }));

  const metricOptions = [
    { value: 'usage', label: 'Usage Count' },
    { value: 'users', label: 'Unique Users' },
    { value: 'duration', label: 'Total Duration' }
  ];

  return (
    <Card>
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Feature Breakdown</h3>
        <Select
          value={metric}
          onChange={e => setMetric(e.target.value)}
          options={metricOptions}
        />
      </div>
      <div className="p-4 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={entry => entry.name}
            >
              {chartData?.map((_, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};