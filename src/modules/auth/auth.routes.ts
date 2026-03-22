import { Router } from 'express';
import { register, login, verifyOTP, resendOTP, adminLogin, forgotPassword, resetPassword, refreshToken } from './auth.controller.js';
import { authLimiter } from '../../middleware/rateLimiter.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/verify-otp', authLimiter, verifyOTP);
router.post('/resend-otp', authLimiter, resendOTP);
router.post('/admin/login', authLimiter, adminLogin);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/refresh-token', protect, refreshToken);

export default router;
