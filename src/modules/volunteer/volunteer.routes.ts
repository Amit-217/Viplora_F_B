import { Router } from 'express';
import { applyAsVolunteer, getAllApplications, updateApplicationStatus } from './volunteer.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { UserRole } from '../user/user.model.js';

const router = Router();

router.post('/apply', protect, applyAsVolunteer);
router.get('/applications', protect, authorize(UserRole.ADMIN), getAllApplications);
router.patch('/applications/:id/status', protect, authorize(UserRole.ADMIN), updateApplicationStatus);

export default router;
