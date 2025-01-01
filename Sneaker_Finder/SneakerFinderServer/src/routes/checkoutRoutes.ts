import express from 'express';
import { getCheckoutInfo, createCheckoutSession } from '../controllers/checkoutController';
import { confirmPayment } from '../controllers/paymentController';
import { handleWebhook } from '../controllers/webhookController';

const router = express.Router();

router.get('/info', getCheckoutInfo);
router.post('/create-checkout-session', createCheckoutSession);
router.post('/confirm', confirmPayment);
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

export default router;
