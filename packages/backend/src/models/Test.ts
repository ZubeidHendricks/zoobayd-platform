import { Schema, model } from 'mongoose';

const testSchema = new Schema({
  name: { type: String, required: true },
  feature: { type: Schema.Types.ObjectId, ref: 'Feature' },
  variants: [{
    name: String,
    config: Map,
    metrics: {
      conversions: Number,
      engagementRate: Number,
      avgUsageTime: Number
    }
  }],
  status: String,
  startDate: Date,
  endDate: Date,
  targetSegment: Map
});

export const Test = model('Test', testSchema);