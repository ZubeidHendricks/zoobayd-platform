import React from 'react';
import { Card } from '../ui/Card';
import { ArrowUp, ArrowDown, Activity, Users, Clock, Zap } from 'lucide-react';

interface Props {
  metrics: {
    totalUsage: number;
    activeUsers: number;
    avgSessionDuration: number;
    peakConcurrent: number;
  };
}

export const MetricCards: React.FC<Props> = ({ metrics }) => {
  const cards = [
    {
      title: 'Total Usage',
      value: metrics?.totalUsage.toLocaleString(),
      icon: Activity,
      change: 12.5,
      positive: true
    },
    {
      title: 'Active Users',
      value: metrics?.activeUsers.toLocaleString(),
      icon: Users,
      change: 8.2,
      positive: true
    },
    {
      title: 'Avg Session',
      value: `${Math.round(metrics?.avgSessionDuration / 60)} min`,
      icon: Clock,
      change: -2.4,
      positive: false
    },
    {
      title: 'Peak Concurrent',
      value: metrics?.peakConcurrent.toLocaleString(),
      icon: Zap,
      change: 15.7,
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => (
        <Card key={card.title} className="p-4">
          <div className="flex justify-between">
            <card.icon className="h-6 w-6 text-gray-400" />
            <div className="flex items-center space-x-1">
              <span className={card.positive ? 'text-green-500' : 'text-red-500'}>
                {card.positive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </span>
              <span className={`text-sm ${card.positive ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(card.change)}%
              </span>
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
            <p className="text-2xl font-semibold">{card.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};