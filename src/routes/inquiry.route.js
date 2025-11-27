import express from 'express';
import { 
  createInquiry,
  getAllInquiries,
  getInquiryById,
  deleteInquiry
} from '../controllers/inquiry.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route - anyone can submit an inquiry
router.post('/', createInquiry);

// Admin routes (protected + admin authorization)
router.get('/', authMiddleware, adminAuth, getAllInquiries);
router.get('/:id', authMiddleware, adminAuth, getInquiryById);
router.delete('/:id', authMiddleware, adminAuth, deleteInquiry);

export default router;