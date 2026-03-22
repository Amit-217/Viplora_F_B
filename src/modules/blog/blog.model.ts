import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: mongoose.Types.ObjectId;
  image: string;
  images?: string[]; // Multiple images support
  tags: string[];
  category: string;
  isPublished: boolean;
  createdAt: Date;
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: String, default: 'Viplora Admin' },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true },
  images: [{ type: String }], // Array for multiple images
  tags: [{ type: String }],
  category: { type: String, required: true },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IBlog>('Blog', BlogSchema);
