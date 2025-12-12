import express from 'express';
import { 
  createStudentProject,
  getMyStudentProjects,
  getStudentProjectById,
  updateStudentProject,
  deleteStudentProject,
  getAllStudentProjects,
  getAdminStudentProjectById,
  updateAdminStudentProject,
  deleteAdminStudentProject,
  getPublicStudentProjects // Add this import
} from '../controllers/studentProject.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes (protected)
router.post('/', authMiddleware, createStudentProject);
router.get('/my', authMiddleware, getMyStudentProjects);
router.get('/:id', authMiddleware, getStudentProjectById);
router.put('/:id', authMiddleware, updateStudentProject);
router.delete('/:id', authMiddleware, deleteStudentProject);

// Public route (no authentication required)
router.get('/public/:userId', getPublicStudentProjects); // Add this route

// Admin routes (protected + admin authorization)
router.get('/', authMiddleware, adminAuth, getAllStudentProjects);
router.get('/:id/admin', authMiddleware, adminAuth, getAdminStudentProjectById);
router.put('/:id/admin', authMiddleware, adminAuth, updateAdminStudentProject);
router.delete('/:id/admin', authMiddleware, adminAuth, deleteAdminStudentProject);

export default router;