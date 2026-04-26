import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  category: string;
  urgency: number;
  location: number[];
  status: 'pending' | 'dispatched' | 'completed';
  description?: string;
  karma?: number;
  assignedTo?: string;
  txHash?: string;
}

const TaskSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  urgency: { type: Number, required: true },
  location: { type: [Number], required: true }, // [lat, lng]
  status: { type: String, enum: ['pending', 'dispatched', 'completed'], default: 'pending' },
  description: { type: String },
  karma: { type: Number, default: 0 },
  assignedTo: { type: String },
  txHash: { type: String }
}, {
  timestamps: true
});

export const Task = mongoose.model<ITask>('Task', TaskSchema);
