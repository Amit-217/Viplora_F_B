import { Router } from 'express';
import { getAllPrograms, getProgramBySlug, createProgram, updateProgram } from './program.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { UserRole } from '../user/user.model.js';

const router = Router();

router.get('/', getAllPrograms);
router.get('/:slug', getProgramBySlug);
router.post('/', protect, authorize(UserRole.ADMIN), createProgram);
router.put('/:id', protect, authorize(UserRole.ADMIN), updateProgram);

export default router;
