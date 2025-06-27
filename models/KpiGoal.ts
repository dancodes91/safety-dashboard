import mongoose, { Schema, Model } from 'mongoose';
import { KpiGoal } from '@/types/KpiGoal';

// Create a Schema corresponding to the KpiGoal interface
const kpiGoalSchema = new Schema<KpiGoal>(
  {
    metricName: { type: String, required: true },
    description: { type: String, required: true },
    thresholdRed: { type: Number, required: true },
    thresholdYellow: { type: Number, required: true },
    thresholdGreen: { type: Number, required: true },
    targetValue: { type: Number, required: true },
    unit: { type: String, required: true },
    priority: { type: Number, required: true, default: 5 },
    category: { type: String, required: true },
    dataSource: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
kpiGoalSchema.index({ metricName: 1 }, { unique: true });
kpiGoalSchema.index({ category: 1 });
kpiGoalSchema.index({ priority: 1 });

// Create KpiGoal model or get the existing model
const KpiGoalModel: Model<KpiGoal> = mongoose.models.KpiGoal || mongoose.model<KpiGoal>('KpiGoal', kpiGoalSchema);

export default KpiGoalModel;