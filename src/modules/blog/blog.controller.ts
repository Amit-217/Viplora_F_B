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
    
    const images = req.files ? (req.files as Express.Multer.File[]).map(f => f.path) : [];
    const mainImage = images[0] || req.body.image;

    if (!mainImage) return res.status(400).json({ message: 'Main image is required' });

    const blog = await Blog.create({ 
      ...req.body, 
      slug, 
      image: mainImage,
      images,
      author: (req as any).user?.name || 'Viplora Author',
      authorId: (req as any).user?._id
    });
    res.status(201).json(blog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });

    const user = (req as any).user;
    if (user.role !== 'admin' && blog.authorId?.toString() !== user._id?.toString()) {
      return res.status(403).json({ message: 'Unauthorized, you can only edit your own posts' });
    }

    const updateData = { ...req.body };
    
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const images = (req.files as Express.Multer.File[]).map(f => f.path);
      updateData.images = images;
      updateData.image = images[0];
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedBlog);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });

    const user = (req as any).user;
    if (user.role !== 'admin' && blog.authorId?.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized, you can only delete your own posts' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
