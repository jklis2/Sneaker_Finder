import express from 'express';
import { handleWebhook } from '../controllers/webhookController';

const router = express.Router();

router.post('/stripe', express.raw({ type: '*/*' }), handleWebhook);

export default router;
