import { Schema, model } from 'mongoose';

const auditLogSchema = new Schema({
  action: { 
    type: String, 
    required: true,
    enum: ['access_granted', 'access_revoked', 'quota_updated', 'role_changed', 'test_started']
  },
  actor: {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    team: { type: Schema.Types.ObjectId, ref: 'Team' }
  },
  target: {
    type: { type: String, enum: ['feature', 'user', 'team', 'test'] },
    id: Schema.Types.ObjectId,
  },
  changes: Map,
  metadata: Map,
  timestamp: { type: Date, default: Date.now }
}, { timeseries: { timeField: 'timestamp' } });

auditLogSchema.index({ 'actor.user': 1, 'actor.team': 1, timestamp: -1 });

export const AuditLog = model('AuditLog', auditLogSchema);