import express from 'express';
import { 
  createStudentEducation,
  getMyStudentEducations,
  getPublicStudentEducations,
  updateStudentEducation,
  deleteStudentEducation,
  getStudentEducations,
  deleteAllStudentEducations
} from '../controllers/studentEducation.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes (protected)
router.post('/', authMiddleware, createStudentEducation);
router.get('/my', authMiddleware, getMyStudentEducations);
router.put('/:id', authMiddleware, updateStudentEducation);
router.delete('/:id', authMiddleware, deleteStudentEducation);

// Public route (no authentication required)
router.get('/public/:userId', getPublicStudentEducations);

// Admin routes (protected + admin authorization)
router.get('/:userId', authMiddleware, adminAuth, getStudentEducations);
router.delete('/:userId/all', authMiddleware, adminAuth, deleteAllStudentEducations);

export default router;