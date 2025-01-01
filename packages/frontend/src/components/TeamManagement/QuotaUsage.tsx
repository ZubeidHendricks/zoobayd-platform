import React, { useState, useEffect } from 'react';
import { getQuotaUsage } from '../../api/team';
import { ProgressBar } from '../ui/ProgressBar';
import { Card } from '../ui/Card';

export const QuotaUsage: React.FC = () => {
  const [quotas, setQuotas] = useState([]);

  useEffect(() => {
    fetchQuotas();
  }, []);

  const fetchQuotas = async () => {
    const data = await getQuotaUsage();
    setQuotas(data);
  };

  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Resource Usage</h3>
      </div>
      <div className="p-4 space-y-4">
        {quotas.map(quota => (
          <div key={quota.id}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{quota.name}</span>
              <span className="text-sm text-gray-500">
                {quota.used} / {quota.limit}
              </span>
            </div>
            <ProgressBar 
              value={(quota.used / quota.limit) * 100}
              color={quota.used > quota.limit * 0.9 ? 'red' : 'blue'}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};