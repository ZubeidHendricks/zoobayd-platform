import React from 'react';
import { Dialog } from '../ui/Dialog';
import { Card } from '../ui/Card';
import { X } from 'lucide-react';

interface Props {
  log: {
    action: string;
    actor: {
      user: string;
      team: string;
    };
    target: {
      type: string;
      id: string;
    };
    changes: Record<string, any>;
    metadata: Record<string, any>;
    timestamp: string;
  };
  onClose: () => void;
}

export const LogDetails: React.FC<Props> = ({ log, onClose }) => {
  return (
    <Dialog open onClose={onClose}>
      <Card className="w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Audit Log Details</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Action</h4>
            <p className="mt-1">{log.action.replace(/_/g, ' ')}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Actor</h4>
            <p className="mt-1">
              {log.actor.user || 'System'}
              {log.actor.team && ` (${log.actor.team})`}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Target</h4>
            <p className="mt-1">
              {log.target.type} ({log.target.id})
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Changes</h4>
            <pre className="mt-1 p-2 bg-gray-50 rounded overflow-auto">
              {JSON.stringify(log.changes, null, 2)}
            </pre>
          </div>

          {Object.keys(log.metadata).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Additional Data</h4>
              <pre className="mt-1 p-2 bg-gray-50 rounded overflow-auto">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-500">Timestamp</h4>
            <p className="mt-1">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </Dialog>
  );
};