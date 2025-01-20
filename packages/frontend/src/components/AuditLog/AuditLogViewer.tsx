import React, { useState, useEffect } from 'react';
import { LogFilter } from './LogFilter';
import { LogList } from './LogList';
import { LogDetails } from './LogDetails';
import { getAuditLogs, AuditLog } from '../../api/audit';

interface Filters {
  action: string;
  startDate: Date | null;
  endDate: Date | null;
  actor: string;
}

export const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filters, setFilters] = useState<Filters>({
    action: '',
    startDate: null,
    endDate: null,
    actor: ''
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      const data = await getAuditLogs({
        action: filters.action || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        actor: filters.actor || undefined
      });
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    }
  };

  const handleLogSelect = (log: AuditLog) => {
    setSelectedLog(log);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Audit Log</h1>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <LogFilter filters={filters} onChange={setFilters} />
        </div>
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-lg shadow">
            <LogList logs={logs} onSelect={handleLogSelect} />
          </div>
        </div>
      </div>

      {selectedLog && (
        <LogDetails log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
};