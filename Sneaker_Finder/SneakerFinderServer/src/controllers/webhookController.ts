import { Request, Response } from 'express';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import Order from '../models/Order';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  console.log('Received webhook event');
  const sig = req.headers['stripe-signature'];

  try {
    if (!endpointSecret) {
      throw new Error('Missing Stripe webhook secret');
    }

    if (!sig) {
      throw new Error('No Stripe signature found');
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        throw new Error('No order ID in session metadata');
      }

      await Order.findByIdAndUpdate(orderId, {
        status: 'confirmed',
        paymentId: session.payment_intent as string,
      });
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};
