import mongoose, { Schema, Document } from 'mongoose';

export interface IVolunteer extends Document {
  name: string;
  skills: string[];
  matchScore: number;
  status: string;
  location: number[]; // [lat, lng]
  isGigWorker?: boolean;
}

const VolunteerSchema = new Schema({
  name: { type: String, required: true },
  skills: { type: [String], required: true },
  matchScore: { type: Number, required: true },
  status: { type: String, required: true },
  location: { type: [Number], required: true },
  isGigWorker: { type: Boolean, default: false }
});

export const Volunteer = mongoose.model<IVolunteer>('Volunteer', VolunteerSchema);
