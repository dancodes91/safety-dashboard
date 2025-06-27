import mongoose, { Schema, Model } from 'mongoose';
import { KpaEvent } from '@/types/KpaEvent';

// Create a Schema corresponding to the KpaEvent interface
const kpaEventSchema = new Schema<KpaEvent>(
  {
    reportNumber: { type: String, required: true, unique: true },
    link: { type: String },
    observer: { type: String, required: true },
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    division: { type: String, required: true },
    homePlant: { type: String, required: true },
    hireDate: { type: Date, required: true },
    hireDuration: { type: String, required: true },
    supervisor: { type: String, required: true },
    eventType: { type: String, required: true },
    unitNumber: { type: String, required: true },
    equipmentType: { type: String, required: true },
    jobNumber: { type: String, required: true },
    dateTime: { type: Date, required: true },
    location: { type: String, required: true },
    plant: { type: String, required: true },
    videoLink: { type: String },
    description: { type: String, required: true },
    injuries: { type: Boolean, required: true, default: false },
    preventability: { type: String, required: true },
    eventCategory: { type: String, required: true },
    severityRating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
kpaEventSchema.index({ employeeId: 1 });
kpaEventSchema.index({ eventType: 1 });
kpaEventSchema.index({ dateTime: -1 });
kpaEventSchema.index({ division: 1, plant: 1 });
kpaEventSchema.index({ preventability: 1 });
kpaEventSchema.index({ eventCategory: 1 });
kpaEventSchema.index({ severityRating: 1 });

// Create KpaEvent model or get the existing model
// This approach prevents model overwrite errors during hot reloading
const KpaEventModel: Model<KpaEvent> = mongoose.models.KpaEvent || mongoose.model<KpaEvent>('KpaEvent', kpaEventSchema);

export default KpaEventModel;