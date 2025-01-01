import React, { useState } from 'react';
import { updateRolePermissions } from '../../api/team';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';

const defaultPermissions = {
  manage_members: { label: 'Manage Members', roles: ['admin'] },
  manage_features: { label: 'Manage Features', roles: ['admin', 'manager'] },
  view_analytics: { label: 'View Analytics', roles: ['admin', 'manager', 'analyst'] },
  manage_billing: { label: 'Manage Billing', roles: ['admin'] }
};

export const RoleManager: React.FC = () => {
  const [roles, setRoles] = useState(['admin', 'manager', 'analyst', 'member']);
  const [permissions, setPermissions] = useState(defaultPermissions);

  const handlePermissionChange = async (role: string, permission: string) => {
    const updatedRoles = permissions[permission].roles.includes(role)
      ? permissions[permission].roles.filter(r => r !== role)
      : [...permissions[permission].roles, role];

    const updatedPermissions = {
      ...permissions,
      [permission]: { ...permissions[permission], roles: updatedRoles }
    };

    setPermissions(updatedPermissions);
    await updateRolePermissions(role, permission, updatedRoles);
  };

  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Role Permissions</h3>
      </div>
      <div className="p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left pb-2">Permission</th>
              {roles.map(role => (
                <th key={role} className="text-center pb-2">{role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(permissions).map(([key, { label, roles: permRoles }]) => (
              <tr key={key} className="border-t">
                <td className="py-2">{label}</td>
                {roles.map(role => (
                  <td key={role} className="text-center">
                    <Checkbox
                      checked={permRoles.includes(role)}
                      onChange={() => handlePermissionChange(role, key)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};