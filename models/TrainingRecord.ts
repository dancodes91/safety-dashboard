import mongoose, { Schema, Model } from 'mongoose';
import { TrainingRecord } from '@/types/TrainingRecord';

// Create a Schema corresponding to the TrainingRecord interface
const trainingRecordSchema = new Schema<TrainingRecord>(
  {
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    division: { type: String, required: true },
    trainingType: { type: String, required: true },
    trainingName: { type: String, required: true },
    status: { 
      type: String, 
      required: true,
      enum: ['completed', 'pending', 'overdue', 'expired'],
      default: 'pending'
    },
    completionDate: { type: Date },
    expirationDate: { type: Date },
    requiredByDate: { type: Date, required: true },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
trainingRecordSchema.index({ employeeId: 1 });
trainingRecordSchema.index({ status: 1 });
trainingRecordSchema.index({ trainingType: 1 });
trainingRecordSchema.index({ division: 1 });
trainingRecordSchema.index({ expirationDate: 1 });
trainingRecordSchema.index({ requiredByDate: 1 });

// Create TrainingRecord model or get the existing model
const TrainingRecordModel: Model<TrainingRecord> = 
  mongoose.models.TrainingRecord || 
  mongoose.model<TrainingRecord>('TrainingRecord', trainingRecordSchema);

export default TrainingRecordModel;