import React from 'react';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';

const actionOptions = [
  { value: '', label: 'All Actions' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
];

interface Filters {
  action: string;
  startDate: Date | null;
  endDate: Date | null;
  actor: string;
}

interface LogFilterProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export const LogFilter: React.FC<LogFilterProps> = ({ filters, onChange }) => {
  const handleChange = (key: keyof Filters, value: string | Date | null) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <Card className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Action Type
        </label>
        <div className="mt-1">
          <Select
            value={filters.action}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('action', e.target.value)}
            options={actionOptions}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <div className="mt-1">
          <DatePicker
            selected={filters.startDate}
            onChange={(date) => handleChange('startDate', date)}
            maxDate={filters.endDate}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <div className="mt-1">
          <DatePicker
            selected={filters.endDate}
            onChange={(date) => handleChange('endDate', date)}
            minDate={filters.startDate}
            maxDate={new Date()}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
};