import React from 'react';
import { TeamMembers } from './TeamMembers';
import { FeatureAccess } from './FeatureAccess';
import { QuotaUsage } from './QuotaUsage';
import { RoleManager } from './RoleManager';

export const TeamDashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Team Management</h2>
      <div className="flex space-x-2">
        <InviteButton />
        <SettingsButton />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TeamMembers />
      <RoleManager />
      <FeatureAccess />
      <QuotaUsage />
    </div>
  </div>
);

const InviteButton = () => (
  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
    Invite Member
  </button>
);

const SettingsButton = () => (
  <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
    Settings
  </button>
);