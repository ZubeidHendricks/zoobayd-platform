import React from 'react';
import { Dialog } from '../ui/Dialog';
import { Card } from '../ui/Card';
import { AuditLog } from '../../api/audit';

interface Props {
  log: AuditLog;
  onClose: () => void;
}

export const LogDetails: React.FC<Props> = ({ log, onClose }) => {
  return (
    <Dialog open onClose={onClose}>
      <Card className="w-full max-w-2xl p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Audit Log Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            ×
          </button>
        </div>

        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Action</dt>
            <dd className="mt-1">{log.action}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Performed By</dt>
            <dd className="mt-1">
              <div>{log.actor.user}</div>
              <div className="text-sm text-gray-500">{log.actor.team}</div>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Target</dt>
            <dd className="mt-1">
              <div>{log.target.type}</div>
              <div className="text-sm text-gray-500">{log.target.id}</div>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Changes</dt>
            <dd className="mt-1">
              <pre className="text-sm bg-gray-50 p-3 rounded">
                {JSON.stringify(log.changes, null, 2)}
              </pre>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
            <dd className="mt-1">
              {new Date(log.timestamp).toLocaleString()}
            </dd>
          </div>
        </dl>
      </Card>
    </Dialog>
  );
};