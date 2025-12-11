import express from 'express';
import { 
  createStudentProject,
  uploadStudentProjectImage,
  getMyStudentProjects,
  getPublicStudentProjects,
  updateStudentProject,
  deleteStudentProject,
  getStudentProjects,
  deleteAllStudentProjects,
  upload
} from '../controllers/studentProject.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes (protected)
router.post('/', authMiddleware, upload.single('projectImage'), createStudentProject);
router.post('/upload/image', authMiddleware, upload.single('projectImage'), uploadStudentProjectImage);
router.get('/my', authMiddleware, getMyStudentProjects);
router.put('/:id', authMiddleware, updateStudentProject);
router.delete('/:id', authMiddleware, deleteStudentProject);

// Public route (no authentication required)
router.get('/public/:userId', getPublicStudentProjects);

// Admin routes (protected + admin authorization)
router.get('/:userId', authMiddleware, adminAuth, getStudentProjects);
router.delete('/:userId/all', authMiddleware, adminAuth, deleteAllStudentProjects);

export default router;