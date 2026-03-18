import mongoose, { Schema, Document } from 'mongoose';

export interface IDonation extends Document {
  donorId?: mongoose.Schema.Types.ObjectId;
  programId: mongoose.Schema.Types.ObjectId;
  amount: number;
  currency: string;
  paymentId: string;
  orderId: string;
  signature?: string;
  status: 'pending' | 'completed' | 'failed';
  donorDetails: {
    name: string;
    email: string;
    phone?: string;
  };
  isAnonymous: boolean;
  createdAt: Date;
}

const DonationSchema: Schema = new Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentId: { type: String },
  orderId: { type: String, required: true },
  signature: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  donorDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }
  },
  isAnonymous: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IDonation>('Donation', DonationSchema);
