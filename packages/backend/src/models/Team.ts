import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
  name: { type: String, required: true },
  members: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'member', 'viewer'] }
  }],
  features: [{
    feature: { type: Schema.Types.ObjectId, ref: 'Feature' },
    customQuota: Number,
    restrictions: Map
  }],
  subscription: {
    tier: { type: Schema.Types.ObjectId, ref: 'Tier' },
    customLimits: Map,
    billingCycle: Date
  }
});

export const Team = model('Team', teamSchema);