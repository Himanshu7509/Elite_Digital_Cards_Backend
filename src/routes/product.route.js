import express from 'express';
import { 
  createProduct,
  getMyProducts,
  getPublicProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAdminProductById,
  updateAdminProduct,
  deleteAdminProduct,
  upload
} from '../controllers/product.controller.js';
import { authMiddleware, adminAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Client routes (protected)
router.post('/upload', authMiddleware, upload.single('productPhoto'), createProduct);
router.get('/my', authMiddleware, getMyProducts);
router.get('/public/:userId', getPublicProducts);
router.get('/:id', authMiddleware, getProductById);
router.put('/:id', authMiddleware, upload.single('productPhoto'), updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

// Admin routes (protected + admin authorization)
router.post('/admin/upload', authMiddleware, adminAuth, upload.single('productPhoto'), createProduct);
router.get('/', authMiddleware, adminAuth, getAllProducts);
router.get('/:id/admin', authMiddleware, adminAuth, getAdminProductById);
router.put('/:id/admin', authMiddleware, adminAuth, upload.single('productPhoto'), updateAdminProduct);
router.delete('/:id/admin', authMiddleware, adminAuth, deleteAdminProduct);

export default router;