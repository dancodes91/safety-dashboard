import mongoose, { Schema, Model } from 'mongoose';
import { SamsaraDriverRecord, SpeedingData, DriverEvent } from '@/types/SamsaraDriverRecord';

// Create nested schemas first
const speedingDataSchema = new Schema<SpeedingData>({
  lightTime: { type: String, required: true },
  moderateTime: { type: String, required: true },
  heavyTime: { type: String, required: true },
  totalTime: { type: String, required: true },
  averageSpeed: { type: Number, required: true },
  maxSpeed: { type: Number, required: true },
  speedLimit: { type: Number, required: true },
  countOverSpeed: { type: Number, required: true },
  percentageOverSpeed: { type: Number, required: true },
});

const driverEventSchema = new Schema<DriverEvent>({
  eventType: { type: String, required: true },
  count: { type: Number, required: true },
  severity: { type: Number, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  videoLink: { type: String },
});

// Create the main schema for driver records
const samsaraDriverRecordSchema = new Schema<SamsaraDriverRecord>(
  {
    driverId: { type: String, required: true, unique: true },
    driverName: { type: String, required: true },
    division: { type: String, required: true },
    homePlant: { type: String, required: true },
    hireDate: { type: Date, required: true },
    supervisor: { type: String, required: true },
    safetyScore: { type: Number, required: true },
    previousSafetyScore: { type: Number, required: true },
    safetyScoreDelta: { type: Number, required: true },
    driveTime: { type: Number, required: true },
    totalMiles: { type: Number, required: true },
    speedingData: { type: speedingDataSchema, required: true },
    events: { type: [driverEventSchema], default: [] },
    alertCount: { type: Number, required: true },
    warningCount: { type: Number, required: true },
    criticalCount: { type: Number, required: true },
    vehicleInspectionCount: { type: Number, required: true },
    coachingSessionsCompleted: { type: Number, required: true },
    coachingSessionsRequired: { type: Number, required: true },
    lastCoachedDate: { type: Date },
    lastRecordedDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
samsaraDriverRecordSchema.index({ driverId: 1 });
samsaraDriverRecordSchema.index({ driverName: 1 });
samsaraDriverRecordSchema.index({ division: 1, homePlant: 1 });
samsaraDriverRecordSchema.index({ safetyScore: -1 });
samsaraDriverRecordSchema.index({ lastRecordedDate: -1 });

// Create or get existing model
const SamsaraDriverRecordModel: Model<SamsaraDriverRecord> = 
  mongoose.models.SamsaraDriverRecord || 
  mongoose.model<SamsaraDriverRecord>('SamsaraDriverRecord', samsaraDriverRecordSchema);

export default SamsaraDriverRecordModel;