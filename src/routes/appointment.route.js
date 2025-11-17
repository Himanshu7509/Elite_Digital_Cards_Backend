import express from 'express';
import { 
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  getAdminAppointmentById,
  updateAdminAppointment,
  deleteAdminAppointment
} from '../controllers/appointment.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Client routes (protected)
router.post('/', authMiddleware, createAppointment);
router.get('/my', authMiddleware, getMyAppointments);
router.get('/:id', authMiddleware, getAppointmentById);
router.put('/:id', authMiddleware, updateAppointment);
router.delete('/:id', authMiddleware, deleteAppointment);

// Admin routes (protected + admin authorization)
router.get('/', authMiddleware, adminAuth, getAllAppointments);
router.get('/:id/admin', authMiddleware, adminAuth, getAdminAppointmentById);
router.put('/:id/admin', authMiddleware, adminAuth, updateAdminAppointment);
router.delete('/:id/admin', authMiddleware, adminAuth, deleteAdminAppointment);

export default router;