import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../../api/audit';
import { LogList } from './LogList';
import { LogFilter } from './LogFilter';
import { LogDetails } from './LogDetails';
import { ExportButton } from './ExportButton';

export const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    action: '',
    startDate: null,
    endDate: null,
    actor: ''
  });
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    const data = await getAuditLogs(filters);
    setLogs(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Audit Logs</h2>
        <ExportButton logs={logs} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <LogFilter filters={filters} onChange={setFilters} />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-lg shadow">
            <LogList logs={logs} onSelect={setSelectedLog} />
          </div>
        </div>
      </div>

      {selectedLog && (
        <LogDetails log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
};