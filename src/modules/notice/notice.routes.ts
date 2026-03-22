import { Router } from 'express';
import { createNotice, getNotices, deleteNotice } from './notice.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { UserRole } from '../user/user.model.js';

const router = Router();

// Volunteers and Admins can view
router.get('/', protect, getNotices);

// Only Admins can modify
router.post('/', protect, authorize(UserRole.ADMIN), createNotice);
router.delete('/:id', protect, authorize(UserRole.ADMIN), deleteNotice);

export default router;
