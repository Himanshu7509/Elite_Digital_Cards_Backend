import express from 'express';
import { 
  uploadGalleryImage,
  getMyGallery,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  getAllGalleryItems,
  getAdminGalleryItemById,
  updateAdminGalleryItem,
  deleteAdminGalleryItem,
  upload
} from '../controllers/gallery.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Client routes (protected)
router.post('/upload', authMiddleware, upload.single('image'), uploadGalleryImage);
router.get('/my', authMiddleware, getMyGallery);
router.get('/:id', authMiddleware, getGalleryItemById);
router.put('/:id', authMiddleware, updateGalleryItem);
router.delete('/:id', authMiddleware, deleteGalleryItem);

// Admin routes (protected + admin authorization)
router.get('/', authMiddleware, adminAuth, getAllGalleryItems);
router.get('/:id/admin', authMiddleware, adminAuth, getAdminGalleryItemById);
router.put('/:id/admin', authMiddleware, adminAuth, updateAdminGalleryItem);
router.delete('/:id/admin', authMiddleware, adminAuth, deleteAdminGalleryItem);

export default router;