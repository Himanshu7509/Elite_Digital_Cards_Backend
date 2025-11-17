import express from 'express';
import { 
  createTestimonial,
  getMyTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  getAdminTestimonialById,
  updateAdminTestimonial,
  deleteAdminTestimonial
} from '../controllers/testimonial.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Client routes (protected)
router.post('/', authMiddleware, createTestimonial);
router.get('/my', authMiddleware, getMyTestimonials);
router.get('/:id', authMiddleware, getTestimonialById);
router.put('/:id', authMiddleware, updateTestimonial);
router.delete('/:id', authMiddleware, deleteTestimonial);

// Admin routes (protected + admin authorization)
router.get('/', authMiddleware, adminAuth, getAllTestimonials);
router.get('/:id/admin', authMiddleware, adminAuth, getAdminTestimonialById);
router.put('/:id/admin', authMiddleware, adminAuth, updateAdminTestimonial);
router.delete('/:id/admin', authMiddleware, adminAuth, deleteAdminTestimonial);

export default router;