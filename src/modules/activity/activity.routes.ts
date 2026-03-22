import { Router } from 'express';
import { createActivity, getActivities, updateActivity, deleteActivity } from './activity.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { UserRole } from '../user/user.model.js';

const router = Router();

// Everyone logged in can view
router.get('/', protect, getActivities);

// Only Admins can modify
router.post('/', protect, authorize(UserRole.ADMIN), createActivity);
router.put('/:id', protect, authorize(UserRole.ADMIN), updateActivity);
router.delete('/:id', protect, authorize(UserRole.ADMIN), deleteActivity);

export default router;
