import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Activity, User, Settings, AlertTriangle } from 'lucide-react';

const getActionIcon = (action: string) => {
  switch (action) {
    case 'access_granted':
    case 'access_revoked':
      return <Settings className="h-5 w-5 text-blue-500" />;
    case 'quota_updated':
      return <Activity className="h-5 w-5 text-green-500" />;
    case 'role_changed':
      return <User className="h-5 w-5 text-purple-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  }
};

export const LogList: React.FC = ({ logs, onSelect }) => {
  return (
    <div className="divide-y divide-gray-200">
      {logs.map(log => (
        <div
          key={log.id}
          className="p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect(log)}
        >
          <div className="flex items-start space-x-3">
            {getActionIcon(log.action)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {log.action.replace(/_/g, ' ')}
              </p>
              <div className="mt-1">
                <p className="text-sm text-gray-500 truncate">
                  By {log.actor.user || 'System'} 
                  {log.actor.team && ` in ${log.actor.team}`}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(log.timestamp))} ago
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};