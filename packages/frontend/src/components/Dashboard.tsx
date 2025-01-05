import React from 'react';

export const Dashboard: React.FC = () => (
  <div className="space-y-6">
    <h2>Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="p-4 border rounded shadow">
        <h3>Quick Actions</h3>
        <ul>
          <li>Create Test</li>
          <li>View Reports</li>
          <li>Settings</li>
        </ul>
      </div>
      <div className="p-4 border rounded shadow">
        <h3>Recent Activity</h3>
        <p>No recent activity</p>
      </div>
      <div className="p-4 border rounded shadow">
        <h3>Statistics</h3>
        <p>Coming soon</p>
      </div>
    </div>
  </div>
);