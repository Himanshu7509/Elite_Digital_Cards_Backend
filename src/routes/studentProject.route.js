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
  deleteAdminStudentProject
} from '../controllers/studentProject.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes (protected)
router.post('/', authMiddleware, createStudentProject);
router.get('/my', authMiddleware, getMyStudentProjects);
router.get('/:id', authMiddleware, getStudentProjectById);
router.put('/:id', authMiddleware, updateStudentProject);
router.delete('/:id', authMiddleware, deleteStudentProject);

// Admin routes (protected + admin authorization)
router.get('/', authMiddleware, adminAuth, getAllStudentProjects);
router.get('/:id/admin', authMiddleware, adminAuth, getAdminStudentProjectById);
router.put('/:id/admin', authMiddleware, adminAuth, updateAdminStudentProject);
router.delete('/:id/admin', authMiddleware, adminAuth, deleteAdminStudentProject);

export default router;