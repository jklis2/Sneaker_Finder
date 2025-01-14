import express from 'express';
import { getUserOrders, getOrderBySessionId } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getUserOrders);

router.get('/session/:sessionId', protect, getOrderBySessionId);

export default router; 
