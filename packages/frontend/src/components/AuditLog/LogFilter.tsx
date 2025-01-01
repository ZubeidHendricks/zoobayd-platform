import React from 'react';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';

const actionOptions = [
  { value: '', label: 'All Actions' },
  { value: 'access_granted', label: 'Access Granted' },
  { value: 'access_revoked', label: 'Access Revoked' },
  { value: 'quota_updated', label: 'Quota Updated' },
  { value: 'role_changed', label: 'Role Changed' }
];

export const LogFilter: React.FC = ({ filters, onChange }) => {
  const handleChange = (key: string, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <Card>
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action Type
          </label>
          <Select
            value={filters.action}
            onChange={e => handleChange('action', e.target.value)}
            options={actionOptions}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <DatePicker
            selected={filters.startDate}
            onChange={date => handleChange('startDate', date)}
            maxDate={filters.endDate || new Date()}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <DatePicker
            selected={filters.endDate}
            onChange={date => handleChange('endDate', date)}
            minDate={filters.startDate}
            maxDate={new Date()}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actor
          </label>
          <input
            type="text"
            value={filters.actor}
            onChange={e => handleChange('actor', e.target.value)}
            placeholder="Search by user or team"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
    </Card>
  );
};