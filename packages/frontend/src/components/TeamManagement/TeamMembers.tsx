import React, { useState, useEffect } from 'react';
import { getTeamMembers, updateMemberRole } from '../../api/team';
import { Avatar } from '../ui/Avatar';
import { RoleSelect } from './RoleSelect';

export const TeamMembers: React.FC = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const data = await getTeamMembers();
    setMembers(data);
  };

  const handleRoleChange = async (userId: string, role: string) => {
    await updateMemberRole(userId, role);
    fetchMembers();
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Team Members</h3>
      </div>
      <div className="p-4">
        <ul className="space-y-4">
          {members.map(member => (
            <li key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar name={member.name} src={member.avatar} />
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              <RoleSelect 
                value={member.role}
                onChange={role => handleRoleChange(member.id, role)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};