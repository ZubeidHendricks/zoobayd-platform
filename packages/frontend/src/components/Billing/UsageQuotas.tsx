import React from 'react';
import { Card } from '../ui/Card';
import { CircularProgress } from '../ui/CircularProgress';
import { updateQuota } from '../../api/billing';

interface Props {
  quotas: {
    feature: string;
    used: number;
    limit: number;
    unit: string;
  }[];
}

export const UsageQuotas: React.FC<Props> = ({ quotas }) => {
  const handleQuotaUpdate = async (feature: string, newLimit: number) => {
    await updateQuota(feature, newLimit);
  };

  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Usage Quotas</h3>
      </div>
      <div className="p-4 space-y-6">
        {quotas?.map(quota => {
          const percentage = (quota.used / quota.limit) * 100;
          const status = percentage > 90 ? 'danger' : percentage > 75 ? 'warning' : 'success';

          return (
            <div key={quota.feature} className="flex items-center space-x-4">
              <CircularProgress
                value={percentage}
                size={64}
                status={status}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium">{quota.feature}</h4>
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => handleQuotaUpdate(quota.feature, quota.limit * 2)}
                  >
                    Increase Limit
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {quota.used.toLocaleString()} / {quota.limit.toLocaleString()} {quota.unit}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};