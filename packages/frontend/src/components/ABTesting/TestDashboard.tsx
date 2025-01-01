import React from 'react';
import { TestList } from './TestList';
import { TestMetrics } from './TestMetrics';
import { CreateTest } from './CreateTest';

export const TestDashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">A/B Tests</h2>
      <CreateTest />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <TestList />
      </div>
      <div>
        <TestMetrics />
      </div>
    </div>
  </div>
);