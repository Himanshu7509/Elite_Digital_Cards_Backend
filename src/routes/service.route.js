import express from 'express';
import { 
  createService,
  getMyServices,
  getServiceById,
  updateService,
  deleteService,
  getAllServices,
  getAdminServiceById,
  updateAdminService,
  deleteAdminService
} from '../controllers/service.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Client routes (protected)
router.post('/', authMiddleware, createService);
router.get('/my', authMiddleware, getMyServices);
router.get('/:id', authMiddleware, getServiceById);
router.put('/:id', authMiddleware, updateService);
router.delete('/:id', authMiddleware, deleteService);

// Admin routes (protected + admin authorization)
router.get('/', authMiddleware, adminAuth, getAllServices);
router.get('/:id/admin', authMiddleware, adminAuth, getAdminServiceById);
router.put('/:id/admin', authMiddleware, adminAuth, updateAdminService);
router.delete('/:id/admin', authMiddleware, adminAuth, deleteAdminService);

export default router;