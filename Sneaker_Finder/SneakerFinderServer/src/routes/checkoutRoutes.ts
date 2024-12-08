import express from 'express';
import { getCheckoutInfo } from '../controllers/checkoutController';

const router = express.Router();

router.get('/info', getCheckoutInfo);

export default router;
