import { Router } from 'express';
import { submitMessage, getAllMessages, updateMessageStatus } from './contact.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { UserRole } from '../user/user.model.js';

const router = Router();

router.post('/', submitMessage);
router.get('/', protect, authorize(UserRole.ADMIN), getAllMessages);
router.patch('/:id', protect, authorize(UserRole.ADMIN), updateMessageStatus);

export default router;
