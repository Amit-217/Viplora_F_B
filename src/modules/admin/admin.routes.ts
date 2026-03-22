import { Router } from 'express';
import { getDashboardStats, getPaymentHistory, addAdmin, getAllAdmins, deleteAdmin } from './admin.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { UserRole } from '../user/user.model.js';

const router = Router();

// Protect all admin routes
router.use(protect);
router.use(authorize(UserRole.ADMIN));

router.get('/stats', getDashboardStats);
router.get('/payments', getPaymentHistory);
router.post('/add', addAdmin);
router.get('/list', getAllAdmins);
router.delete('/:id', deleteAdmin);

export default router;
