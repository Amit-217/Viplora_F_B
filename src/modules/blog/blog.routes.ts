import { Router } from 'express';
import { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from './blog.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { UserRole } from '../user/user.model.js';
import { upload } from '../../config/cloudinary.js';

const router = Router();

router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', protect, authorize(UserRole.ADMIN, UserRole.VOLUNTEER), upload.array('images', 5), createBlog);
router.put('/:id', protect, authorize(UserRole.ADMIN, UserRole.VOLUNTEER), upload.array('images', 5), updateBlog);
router.delete('/:id', protect, authorize(UserRole.ADMIN, UserRole.VOLUNTEER), deleteBlog);

export default router;
