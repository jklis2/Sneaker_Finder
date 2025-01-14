import express, { Request } from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminMiddleware';
import { getAllOrders, updateOrderStatus } from '../controllers/adminController';

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(isAdmin);

// Order management routes
router.get('/orders', asyncHandler(getAllOrders));
router.patch('/orders/:orderId', asyncHandler(updateOrderStatus));

export default router;
