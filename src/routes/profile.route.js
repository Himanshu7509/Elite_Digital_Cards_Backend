import express from 'express';
import { 
  createProfile,
  uploadProfileImage,
  uploadBannerImage,
  getMyProfile,
  getPublicProfile,
  updateMyProfile,
  deleteMyProfile,
  getAllProfiles,
  getClientProfile,
  updateClientProfile,
  deleteClientProfile,
  getDashboardStats,
  upload
} from '../controllers/profile.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Client routes (protected)
router.post('/', authMiddleware, createProfile);
router.post('/upload/profile-image', authMiddleware, upload.single('profileImg'), uploadProfileImage);
router.post('/upload/banner-image', authMiddleware, upload.single('bannerImg'), uploadBannerImage);
router.put('/upload/profile-image', authMiddleware, upload.single('profileImg'), uploadProfileImage);
router.put('/upload/banner-image', authMiddleware, upload.single('bannerImg'), uploadBannerImage);
router.get('/me', authMiddleware, getMyProfile);
router.put('/me', authMiddleware, updateMyProfile);
router.delete('/me', authMiddleware, deleteMyProfile);

// Public route (no authentication required)
router.get('/public/:userId', getPublicProfile);

// Admin routes (protected + admin authorization)
router.get('/', authMiddleware, adminAuth, getAllProfiles);
router.get('/dashboard-stats', authMiddleware, adminAuth, getDashboardStats);
router.get('/:id', authMiddleware, adminAuth, getClientProfile);
router.put('/:id', authMiddleware, adminAuth, updateClientProfile);
router.delete('/:id', authMiddleware, adminAuth, deleteClientProfile);

export default router;