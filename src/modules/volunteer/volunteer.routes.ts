import { Router } from 'express';
import { applyAsVolunteer, getAllApplications, updateApplicationStatus, getApplicationById, updateApplication, deleteApplication } from './volunteer.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { UserRole } from '../user/user.model.js';

const router = Router();

router.post('/apply', applyAsVolunteer);
router.get('/applications', protect, authorize(UserRole.ADMIN), getAllApplications);
router.get('/applications/:id', protect, authorize(UserRole.ADMIN), getApplicationById);
router.patch('/applications/:id/status', protect, authorize(UserRole.ADMIN), updateApplicationStatus);
router.put('/applications/:id', protect, authorize(UserRole.ADMIN), updateApplication);
router.delete('/applications/:id', protect, authorize(UserRole.ADMIN), deleteApplication);

export default router;
