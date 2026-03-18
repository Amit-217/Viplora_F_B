import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  image: string;
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
  image: { type: String, required: true },
  tags: [{ type: String }],
  category: { type: String, required: true },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IBlog>('Blog', BlogSchema);
