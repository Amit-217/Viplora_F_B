import { Router } from 'express';
import { getAllGallery, createGalleryItem, deleteGalleryItem } from './gallery.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { UserRole } from '../user/user.model.js';

const router = Router();

router.get('/', getAllGallery);
router.post('/', protect, authorize(UserRole.ADMIN), createGalleryItem);
router.delete('/:id', protect, authorize(UserRole.ADMIN), deleteGalleryItem);

export default router;
