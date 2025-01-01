import React from 'react';
import { Card } from '../ui/Card';
import { AlertTriangle, AlertCircle, Bell } from 'lucide-react';

interface Props {
  alerts: {
    id: string;
    type: 'warning' | 'critical' | 'info';
    message: string;
    feature: string;
    timestamp: string;
  }[];
}

export const QuotaAlerts: React.FC<Props> = ({ alerts }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Usage Alerts</h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {alerts?.map(alert => (
            <div 
              key={alert.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded"
            >
              {getAlertIcon(alert.type)}
              <div>
                <p className="font-medium">{alert.message}</p>
                <div className="flex space-x-2 mt-1 text-sm text-gray-500">
                  <span>{alert.feature}</span>
                  <span>•</span>
                  <time>{new Date(alert.timestamp).toLocaleString()}</time>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};