import mongoose, { Schema, Model } from 'mongoose';
import { KpiGoal } from '@/types/KpiGoal';

// Create a Schema corresponding to the KpiGoal interface
const kpiGoalSchema = new Schema<KpiGoal>(
  {
    metricName: { type: String, required: true },
    description: { type: String, required: true },
    targetValue: { type: Number, required: true },
    yellowThreshold: { type: Number, required: true },
    redThreshold: { type: Number, required: true },
    unit: { type: String, required: true },
    division: { type: String, required: true },
    plant: { type: String, required: true },
    applicableTo: { type: String, required: true },
    effectiveDate: { type: Date, required: true },
    expirationDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
kpiGoalSchema.index({ metricName: 1 }, { unique: true });
kpiGoalSchema.index({ division: 1 });
kpiGoalSchema.index({ plant: 1 });
kpiGoalSchema.index({ applicableTo: 1 });
kpiGoalSchema.index({ effectiveDate: 1 });

// Create KpiGoal model or get the existing model
const KpiGoalModel: Model<KpiGoal> = mongoose.models.KpiGoal || mongoose.model<KpiGoal>('KpiGoal', kpiGoalSchema);

export default KpiGoalModel;
