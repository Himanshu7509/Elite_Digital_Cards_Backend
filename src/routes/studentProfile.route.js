import express from 'express';
import { 
  createStudentProfile,
  uploadStudentProfilePic,
  uploadStudentBannerPic,
  getMyStudentProfile,
  getPublicStudentProfile,
  updateMyStudentProfile,
  deleteMyStudentProfile,
  getAllStudentProfiles,
  getStudentProfile,
  updateStudentProfile,
  deleteStudentProfile,
  upload
} from '../controllers/studentProfile.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student routes (protected)
router.post('/', authMiddleware, createStudentProfile);
router.post('/upload/profile-pic', authMiddleware, upload.single('profilePic'), uploadStudentProfilePic);
router.post('/upload/banner-pic', authMiddleware, upload.single('bannerPic'), uploadStudentBannerPic);
router.put('/upload/profile-pic', authMiddleware, upload.single('profilePic'), uploadStudentProfilePic);
router.put('/upload/banner-pic', authMiddleware, upload.single('bannerPic'), uploadStudentBannerPic);
router.get('/me', authMiddleware, getMyStudentProfile);
router.put('/me', authMiddleware, updateMyStudentProfile);
router.delete('/me', authMiddleware, deleteMyStudentProfile);

// Public route (no authentication required)
router.get('/public/:userId', getPublicStudentProfile);

// Admin routes (protected + admin authorization)
router.get('/', authMiddleware, adminAuth, getAllStudentProfiles);
router.get('/:id', authMiddleware, adminAuth, getStudentProfile);
router.put('/:id', authMiddleware, adminAuth, updateStudentProfile);
router.delete('/:id', authMiddleware, adminAuth, deleteStudentProfile);

export default router;