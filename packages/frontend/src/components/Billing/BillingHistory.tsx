import React from 'react';
import { Card } from '../ui/Card';
import { Download } from 'lucide-react';

interface Props {
  history: {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    items: {
      feature: string;
      usage: number;
      cost: number;
    }[];
  }[];
}

export const BillingHistory: React.FC<Props> = ({ history }) => {
  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Billing History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Items</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {history?.map(invoice => (
              <tr key={invoice.id}>
                <td className="px-4 py-3 text-sm">
                  {new Date(invoice.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  ${invoice.amount}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {invoice.items.length} items
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-gray-400 hover:text-gray-500">
                    <Download className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};