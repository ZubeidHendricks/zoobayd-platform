import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  currentTier: { type: Schema.Types.ObjectId, ref: 'Tier' },
  usageMetrics: {
    featureUsage: Map,
    lastActive: Date,
    totalSessions: Number
  },
  trials: [{
    feature: String,
    expiresAt: Date
  }]
});

export const User = model('User', userSchema);