import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Props {
  data: {
    plan: string;
    status: string;
    billingPeriod: {
      start: string;
      end: string;
    };
    currentCost: number;
    nextBill: number;
    features: string[];
  };
}

export const SubscriptionDetails: React.FC<Props> = ({ data }) => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">{data?.plan}</h3>
            <p className="text-gray-500">Billing period: {new Date(data?.billingPeriod.start).toLocaleDateString()} - {new Date(data?.billingPeriod.end).toLocaleDateString()}</p>
          </div>
          <Badge variant={data?.status === 'active' ? 'success' : 'warning'}>
            {data?.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Usage</p>
            <p className="text-2xl font-semibold">${data?.currentCost}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Next Bill (Estimated)</p>
            <p className="text-2xl font-semibold">${data?.nextBill}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Included Features</p>
          <div className="flex flex-wrap gap-2">
            {data?.features.map(feature => (
              <span key={feature} className="px-2 py-1 bg-gray-100 rounded text-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};