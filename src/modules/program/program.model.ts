import mongoose, { Schema, Document } from 'mongoose';

export interface IProgram extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: 'education' | 'food' | 'farmers' | 'water' | 'environment' | 'health';
  image: string;
  gallery: string[];
  goalAmount: number;
  raisedAmount: number;
  impactStats: {
    label: string;
    value: string;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['education', 'food', 'farmers', 'water', 'environment', 'health'],
    required: true 
  },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  goalAmount: { type: Number, default: 0 },
  raisedAmount: { type: Number, default: 0 },
  impactStats: [{
    label: { type: String },
    value: { type: String }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IProgram>('Program', ProgramSchema);
