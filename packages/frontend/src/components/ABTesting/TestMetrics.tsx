import React from 'react';

export const TestMetrics: React.FC = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg font-semibold mb-4">Test Metrics</h3>
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded">
        <div className="text-sm text-gray-600">Active Tests</div>
        <div className="text-2xl font-bold">1</div>
      </div>
      <div className="p-4 bg-gray-50 rounded">
        <div className="text-sm text-gray-600">Total Participants</div>
        <div className="text-2xl font-bold">1,234</div>
      </div>
      <div className="p-4 bg-gray-50 rounded">
        <div className="text-sm text-gray-600">Average Duration</div>
        <div className="text-2xl font-bold">14 days</div>
      </div>
    </div>
  </div>
);