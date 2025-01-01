import { Schema, model } from 'mongoose';

const usageMetricsSchema = new Schema({
  feature: { type: Schema.Types.ObjectId, ref: 'Feature' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  timestamp: { type: Date, default: Date.now },
  metrics: {
    duration: Number,
    operations: Number,
    dataProcessed: Number,
    apiCalls: Number,
    customMetrics: Map
  },
  billing: {
    cost: Number,
    quotaImpact: Number
  }
}, { timeseries: { timeField: 'timestamp', metaField: 'feature' } });

export const UsageMetrics = model('UsageMetrics', usageMetricsSchema);