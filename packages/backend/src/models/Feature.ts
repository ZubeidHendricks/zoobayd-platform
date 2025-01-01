import { Schema, model } from 'mongoose';

const featureSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  metrics: {
    totalUsage: Number,
    activeUsers: Number,
    avgSessionDuration: Number
  },
  abTests: [{
    testId: { type: Schema.Types.ObjectId, ref: 'Test' },
    status: String,
    metrics: Map
  }]
});

export const Feature = model('Feature', featureSchema);