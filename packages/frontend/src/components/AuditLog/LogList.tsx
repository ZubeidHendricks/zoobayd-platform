import React from 'react';
import { AuditLog } from '../../api/audit';

interface LogListProps {
  logs: AuditLog[];
  onSelect: (log: AuditLog) => void;
}

export const LogList: React.FC<LogListProps> = ({ logs, onSelect }) => {
  return (
    <div className="divide-y divide-gray-200">
      {logs.map((log) => (
        <div
          key={log.id}
          className="p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect(log)}
        >
          <div className="flex justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {log.actor.user}
              </p>
              <p className="text-sm text-gray-500">
                {log.action}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(log.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};