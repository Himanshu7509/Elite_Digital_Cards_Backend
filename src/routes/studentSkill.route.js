import express from 'express';
import { 
  createStudentSkill,
  getMyStudentSkills,
  getPublicStudentSkills,
  updateStudentSkill,
  deleteStudentSkill,
  getStudentSkills,
  deleteAllStudentSkills
} from '../controllers/studentSkill.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes (protected)
router.post('/', authMiddleware, createStudentSkill);
router.get('/my', authMiddleware, getMyStudentSkills);
router.put('/:id', authMiddleware, updateStudentSkill);
router.delete('/:id', authMiddleware, deleteStudentSkill);

// Public route (no authentication required)
router.get('/public/:userId', getPublicStudentSkills);

// Admin routes (protected + admin authorization)
router.get('/:userId', authMiddleware, adminAuth, getStudentSkills);
router.delete('/:userId/all', authMiddleware, adminAuth, deleteAllStudentSkills);

export default router;