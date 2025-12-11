import express from 'express';
import { 
  createStudentAward,
  uploadStudentAwardImage,
  getMyStudentAwards,
  getPublicStudentAwards,
  updateStudentAward,
  deleteStudentAward,
  getStudentAwards,
  deleteAllStudentAwards,
  upload
} from '../controllers/studentAward.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes (protected)
router.post('/', authMiddleware, upload.single('awardImage'), createStudentAward);
router.post('/upload/image', authMiddleware, upload.single('awardImage'), uploadStudentAwardImage);
router.get('/my', authMiddleware, getMyStudentAwards);
router.put('/:id', authMiddleware, updateStudentAward);
router.delete('/:id', authMiddleware, deleteStudentAward);

// Public route (no authentication required)
router.get('/public/:userId', getPublicStudentAwards);

// Admin routes (protected + admin authorization)
router.get('/:userId', authMiddleware, adminAuth, getStudentAwards);
router.delete('/:userId/all', authMiddleware, adminAuth, deleteAllStudentAwards);

export default router;