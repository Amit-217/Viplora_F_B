import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  image: string;
  images?: string[]; // Multiple images support
  category: 'events' | 'programs' | 'impact' | 'volunteers';
  programId?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const GallerySchema: Schema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }], // Array for multiple images
  category: { 
    type: String, 
    enum: ['events', 'programs', 'impact', 'volunteers'],
    required: true 
  },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' }
}, { timestamps: true });

export default mongoose.model<IGallery>('Gallery', GallerySchema);
