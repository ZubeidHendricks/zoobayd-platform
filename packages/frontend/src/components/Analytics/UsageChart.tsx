import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface Props {
  data: {
    timestamp: string;
    features: Record<string, number>;
  }[];
}

export const UsageChart: React.FC<Props> = ({ data }) => {
  const colors = ['#2563eb', '#7c3aed', '#db2777', '#ea580c'];

  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Usage Trends</h3>
      </div>
      <div className="p-4 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={timestamp => new Date(timestamp).toLocaleDateString()} 
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(data?.[0]?.features || {}).map((feature, index) => (
              <Line
                key={feature}
                type="monotone"
                dataKey={`features.${feature}`}
                name={feature}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};