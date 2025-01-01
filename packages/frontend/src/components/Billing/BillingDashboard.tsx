import React, { useState, useEffect } from 'react';
import { getBillingData } from '../../api/billing';
import { UsageQuotas } from './UsageQuotas';
import { BillingHistory } from './BillingHistory';
import { QuotaAlerts } from './QuotaAlerts';
import { SubscriptionDetails } from './SubscriptionDetails';

export const BillingDashboard: React.FC = () => {
  const [billingData, setBillingData] = useState(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    const data = await getBillingData();
    setBillingData(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Billing & Usage</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Manage Subscription
        </button>
      </div>

      <SubscriptionDetails data={billingData?.subscription} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsageQuotas quotas={billingData?.quotas} />
        <QuotaAlerts alerts={billingData?.alerts} />
      </div>
      
      <BillingHistory history={billingData?.invoices} />
    </div>
  );
};