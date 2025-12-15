import express from 'express';
import { 
  createStudentEducation,
  getMyStudentEducations,
  getStudentEducationById,
  updateStudentEducation,
  deleteStudentEducation,
  getAllStudentEducations,
  getAdminStudentEducationById,
  updateAdminStudentEducation,
  deleteAdminStudentEducation,
  createAdminStudentEducation,
  getPublicStudentEducations // Add this import
} from '../controllers/studentEducation.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes (protected)
router.post('/', authMiddleware, createStudentEducation);
router.get('/my', authMiddleware, getMyStudentEducations);
router.get('/:id', authMiddleware, getStudentEducationById);
router.put('/:id', authMiddleware, updateStudentEducation);
router.delete('/:id', authMiddleware, deleteStudentEducation);

// Public route (no authentication required)
router.get('/public/:userId', getPublicStudentEducations); // Add this route

// Admin routes (protected + admin authorization)
router.get('/', authMiddleware, adminAuth, getAllStudentEducations);
router.get('/:id/admin', authMiddleware, adminAuth, getAdminStudentEducationById);
router.post('/admin/create', authMiddleware, adminAuth, createAdminStudentEducation);
router.put('/:id/admin', authMiddleware, adminAuth, updateAdminStudentEducation);
router.delete('/:id/admin', authMiddleware, adminAuth, deleteAdminStudentEducation);

export default router;