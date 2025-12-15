import express from 'express';
import { 
  createStudentExperience,
  getMyStudentExperiences,
  getStudentExperienceById,
  updateStudentExperience,
  deleteStudentExperience,
  getAllStudentExperiences,
  getAdminStudentExperienceById,
  updateAdminStudentExperience,
  deleteAdminStudentExperience,
  createAdminStudentExperience,
  getPublicStudentExperiences // Add this import
} from '../controllers/studentExperience.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes (protected)
router.post('/', authMiddleware, createStudentExperience);
router.get('/my', authMiddleware, getMyStudentExperiences);
router.get('/:id', authMiddleware, getStudentExperienceById);
router.put('/:id', authMiddleware, updateStudentExperience);
router.delete('/:id', authMiddleware, deleteStudentExperience);

// Public route (no authentication required)
router.get('/public/:userId', getPublicStudentExperiences); // Add this route

// Admin routes (protected + admin authorization)
router.get('/', authMiddleware, adminAuth, getAllStudentExperiences);
router.get('/:id/admin', authMiddleware, adminAuth, getAdminStudentExperienceById);
router.post('/admin/create', authMiddleware, adminAuth, createAdminStudentExperience);
router.put('/:id/admin', authMiddleware, adminAuth, updateAdminStudentExperience);
router.delete('/:id/admin', authMiddleware, adminAuth, deleteAdminStudentExperience);

export default router;