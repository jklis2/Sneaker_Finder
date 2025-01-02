import express from 'express';
import { getCheckoutInfo, createCheckoutSession } from '../controllers/checkoutController';
import { confirmPayment } from '../controllers/paymentController';
import { handleWebhook } from '../controllers/webhookController';

const router = express.Router();

// Regular routes with JSON parsing
router.get('/info', getCheckoutInfo);
router.post('/create-checkout-session', createCheckoutSession);
router.post('/confirm', confirmPayment);

// Webhook route with raw body parsing
router.post(
  '/webhook',
  express.raw({ type: 'application/json', verify: (req, res, buf) => {
    (req as any).rawBody = buf;
  }}),
  handleWebhook
);

export default router;
