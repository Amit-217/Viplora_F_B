import { Request, Response } from 'express';
import Blog from './blog.model.js';

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const slug = req.body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const blog = await Blog.create({ ...req.body, slug });
    res.status(201).json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
