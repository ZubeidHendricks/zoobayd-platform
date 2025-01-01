import React from 'react';
import { Download } from 'lucide-react';
import { exportToCSV } from '../../utils/export';

interface Props {
  logs: any[];
}

export const ExportButton: React.FC<Props> = ({ logs }) => {
  const handleExport = () => {
    const data = logs.map(log => ({
      Action: log.action.replace(/_/g, ' '),
      Actor: log.actor.user || 'System',
      Team: log.actor.team || 'N/A',
      'Target Type': log.target.type,
      'Target ID': log.target.id,
      Changes: JSON.stringify(log.changes),
      Timestamp: new Date(log.timestamp).toLocaleString()
    }));

    exportToCSV(data, 'audit-logs.csv');
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center space-x-2 px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
    >
      <Download className="h-4 w-4" />
      <span>Export Logs</span>
    </button>
  );
};