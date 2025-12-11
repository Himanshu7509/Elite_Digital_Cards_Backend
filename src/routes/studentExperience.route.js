import express from 'express';
import { 
  createStudentExperience,
  getMyStudentExperiences,
  getPublicStudentExperiences,
  updateStudentExperience,
  deleteStudentExperience,
  getStudentExperiences,
  deleteAllStudentExperiences
} from '../controllers/studentExperience.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes (protected)
router.post('/', authMiddleware, createStudentExperience);
router.get('/my', authMiddleware, getMyStudentExperiences);
router.put('/:id', authMiddleware, updateStudentExperience);
router.delete('/:id', authMiddleware, deleteStudentExperience);

// Public route (no authentication required)
router.get('/public/:userId', getPublicStudentExperiences);

// Admin routes (protected + admin authorization)
router.get('/:userId', authMiddleware, adminAuth, getStudentExperiences);
router.delete('/:userId/all', authMiddleware, adminAuth, deleteAllStudentExperiences);

export default router;