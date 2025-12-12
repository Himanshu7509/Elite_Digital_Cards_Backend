import express from 'express';
import { 
  createStudentSkill,
  getMyStudentSkills,
  getStudentSkillById,
  updateStudentSkill,
  deleteStudentSkill,
  getAllStudentSkills,
  getAdminStudentSkillById,
  updateAdminStudentSkill,
  deleteAdminStudentSkill,
  getPublicStudentSkills // Add this import
} from '../controllers/studentSkill.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes (protected)
router.post('/', authMiddleware, createStudentSkill);
router.get('/my', authMiddleware, getMyStudentSkills);
router.get('/:id', authMiddleware, getStudentSkillById);
router.put('/:id', authMiddleware, updateStudentSkill);
router.delete('/:id', authMiddleware, deleteStudentSkill);

// Public route (no authentication required)
router.get('/public/:userId', getPublicStudentSkills); // Add this route

// Admin routes (protected + admin authorization)
router.get('/', authMiddleware, adminAuth, getAllStudentSkills);
router.get('/:id/admin', authMiddleware, adminAuth, getAdminStudentSkillById);
router.put('/:id/admin', authMiddleware, adminAuth, updateAdminStudentSkill);
router.delete('/:id/admin', authMiddleware, adminAuth, deleteAdminStudentSkill);

export default router;