import { Router } from 'express';
import { createOrder, verifyPayment, getUserDonations } from './donation.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/order', createOrder);
router.post('/verify', verifyPayment);
router.get('/user', protect, getUserDonations);

export default router;
