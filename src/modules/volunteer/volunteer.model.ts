import mongoose, { Schema, Document } from 'mongoose';

export interface IVolunteerApplication extends Document {
  userId?: mongoose.Schema.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  skills: string;
  location: string;
  availability: 'weekdays' | 'weekends' | 'evenings' | 'flexible';
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: Date;
}

const VolunteerApplicationSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  occupation: { type: String, required: true },
  skills: { type: String },
  location: { type: String },
  availability: { 
    type: String, 
    enum: ['weekdays', 'weekends', 'evenings', 'flexible'], 
    default: 'weekdays' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

export default mongoose.model<IVolunteerApplication>('VolunteerApplication', VolunteerApplicationSchema);
