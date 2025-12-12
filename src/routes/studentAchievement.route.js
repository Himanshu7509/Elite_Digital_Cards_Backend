import express from 'express';
import { 
  createStudentAchievement,
  getMyStudentAchievements,
  getStudentAchievementById,
  updateStudentAchievement,
  deleteStudentAchievement,
  getAllStudentAchievements,
  getAdminStudentAchievementById,
  updateAdminStudentAchievement,
  deleteAdminStudentAchievement
} from '../controllers/studentAchievement.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes (protected)
router.post('/', authMiddleware, createStudentAchievement);
router.get('/my', authMiddleware, getMyStudentAchievements);
router.get('/:id', authMiddleware, getStudentAchievementById);
router.put('/:id', authMiddleware, updateStudentAchievement);
router.delete('/:id', authMiddleware, deleteStudentAchievement);

// Admin routes (protected + admin authorization)
router.get('/', authMiddleware, adminAuth, getAllStudentAchievements);
router.get('/:id/admin', authMiddleware, adminAuth, getAdminStudentAchievementById);
router.put('/:id/admin', authMiddleware, adminAuth, updateAdminStudentAchievement);
router.delete('/:id/admin', authMiddleware, adminAuth, deleteAdminStudentAchievement);

export default router;