import express from 'express';
import { getUserOrders } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getUserOrders);

export default router;
