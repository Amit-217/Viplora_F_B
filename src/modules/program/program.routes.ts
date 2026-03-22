import { Router } from 'express';
import { getAllPrograms, getProgramBySlug, createProgram, updateProgram, deleteProgram } from './program.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { UserRole } from '../user/user.model.js';
import { upload } from '../../config/cloudinary.js';

const router = Router();

router.get('/', getAllPrograms);
router.get('/:slug', getProgramBySlug);
router.post('/', protect, authorize(UserRole.ADMIN), upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]), createProgram);
router.put('/:id', protect, authorize(UserRole.ADMIN), upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]), updateProgram);
router.delete('/:id', protect, authorize(UserRole.ADMIN), deleteProgram);

export default router;
