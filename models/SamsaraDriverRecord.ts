import mongoose, { Schema, Model } from 'mongoose';
import { SamsaraDriverRecord, SpeedingData, DriverEvents } from '@/types/SamsaraDriverRecord';

// Create nested schemas first
const speedingDataSchema = new Schema<SpeedingData>({
  lightTime: { type: String, required: true },
  moderateTime: { type: String, required: true },
  heavyTime: { type: String, required: true },
  severeTime: { type: String, required: true },
  maxSpeedTime: { type: String, required: true },
  manualCount: { type: Number, required: true },
  percentLight: { type: Number, required: true },
  percentModerate: { type: Number, required: true },
  percentHeavy: { type: Number, required: true },
  percentSevere: { type: Number, required: true },
  percentMax: { type: Number, required: true },
  lightCount: { type: Number, required: true },
  moderateCount: { type: Number, required: true },
  heavyCount: { type: Number, required: true },
  severeCount: { type: Number, required: true },
  maxCount: { type: Number, required: true },
  maxSpeed: { type: Number, required: true },
  maxSpeedAt: { type: Date, required: true },
});

const driverEventsSchema = new Schema<DriverEvents>({
  crash: { type: Number, required: true, default: 0 },
  followingDistance: { type: Number, required: true, default: 0 },
  following0to2s: { type: Number, required: true, default: 0 },
  following2to4s: { type: Number, required: true, default: 0 },
  lateResponse: { type: Number, required: true, default: 0 },
  defensiveDriving: { type: Number, required: true, default: 0 },
  nearCollision: { type: Number, required: true, default: 0 },
  harshAccel: { type: Number, required: true, default: 0 },
  harshBrake: { type: Number, required: true, default: 0 },
  harshTurn: { type: Number, required: true, default: 0 },
  mobileUsage: { type: Number, required: true, default: 0 },
  inattentiveDriving: { type: Number, required: true, default: 0 },
  drowsy: { type: Number, required: true, default: 0 },
  rollingStop: { type: Number, required: true, default: 0 },
  didNotYield: { type: Number, required: true, default: 0 },
  ranRedLight: { type: Number, required: true, default: 0 },
  laneDeparture: { type: Number, required: true, default: 0 },
  obstructedCameraAuto: { type: Number, required: true, default: 0 },
  obstructedCameraManual: { type: Number, required: true, default: 0 },
  eatingDrinking: { type: Number, required: true, default: 0 },
  smoking: { type: Number, required: true, default: 0 },
  noSeatBelt: { type: Number, required: true, default: 0 },
  forwardCollisionWarning: { type: Number, required: true, default: 0 },
});

// Create the main schema for driver records
const samsaraDriverRecordSchema = new Schema<SamsaraDriverRecord>(
  {
    rank: { type: Number, required: true },
    driverName: { type: String, required: true },
    driverTags: { type: String, required: true },
    tagPaths: { type: String, required: true },
    driverId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    safetyScore: { type: Number, required: true },
    driveTime: { type: String, required: true },
    totalDistance: { type: Number, required: true },
    totalEvents: { type: Number, required: true },
    totalBehaviors: { type: Number, required: true },
    speedingData: { type: speedingDataSchema, required: true },
    events: { type: driverEventsSchema, required: true },
    weekStartDate: { type: Date, required: true },
    weekEndDate: { type: Date, required: true },
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
