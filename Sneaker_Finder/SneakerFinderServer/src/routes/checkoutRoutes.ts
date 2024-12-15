import express from 'express';
import { getCheckoutInfo, createCheckoutSession } from '../controllers/checkoutController';

const router = express.Router();

router.get('/info', getCheckoutInfo);
router.post('/create-checkout-session', createCheckoutSession);

export default router;
