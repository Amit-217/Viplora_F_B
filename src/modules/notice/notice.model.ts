import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
  title: string;
  message: string;
  image?: string;
  link?: string; // e.g., Meeting URL
  targetAudience: 'all' | 'volunteer';
  isPinned: boolean;
  createdAt: Date;
}

const NoticeSchema: Schema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  image: { type: String },
  link: { type: String },
  targetAudience: { 
    type: String, 
    enum: ['all', 'volunteer'], 
    default: 'volunteer' 
  },
  isPinned: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<INotice>('Notice', NoticeSchema);
