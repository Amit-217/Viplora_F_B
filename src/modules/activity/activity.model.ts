import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  type: 'event' | 'assignment';
  description?: string;
  date: Date;
  location?: string; // For events
  status: 'pending' | 'completed'; // For assignments
  createdAt: Date;
}

const ActivitySchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['event', 'assignment'], required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
