import { Team, User, AuditLog } from '../../models';

export class TeamPermissionManager {
  async assignRole(teamId: string, userId: string, role: string): Promise<void> {
    const team = await Team.findByIdAndUpdate(
      teamId,
      { $push: { members: { user: userId, role } } }
    );

    await AuditLog.create({
      action: 'role_changed',
      actor: { team: teamId },
      target: { type: 'user', id: userId },
      changes: { role }
    });
  }

  async getTeamPermissions(teamId: string, featureId: string) {
    const team = await Team.findById(teamId)
      .populate('features.feature')
      .exec();
    
    return team?.features.find(f => f.feature.id === featureId);
  }

  async updateTeamRestrictions(teamId: string, featureId: string, restrictions: Map<string, any>) {
    await Team.updateOne(
      { _id: teamId, 'features.feature': featureId },
      { $set: { 'features.$.restrictions': restrictions } }
    );
  }
}