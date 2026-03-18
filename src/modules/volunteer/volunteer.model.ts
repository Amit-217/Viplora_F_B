import mongoose, { Schema, Document } from 'mongoose';

export interface IVolunteerApplication extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  skills: string[];
  reason: string;
  availability: 'weekdays' | 'weekends' | 'both';
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: Date;
}

const VolunteerApplicationSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  occupation: { type: String, required: true },
  skills: [{ type: String }],
  reason: { type: String, required: true },
  availability: { 
    type: String, 
    enum: ['weekdays', 'weekends', 'both'], 
    default: 'weekdays' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

export default mongoose.model<IVolunteerApplication>('VolunteerApplication', VolunteerApplicationSchema);
