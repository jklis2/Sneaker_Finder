import { Request, Response } from 'express';
import Stripe from 'stripe';
import Payment from '../models/Payment';
import Cart from '../models/Cart';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'];

  if (!sig || !endpointSecret) {
    res.status(400).send('Webhook Error: No signature');
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      
      if (userId) {
        try {
          // Create payment record
          const payment = new Payment({
            userId,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            paymentMethod: 'card',
            status: 'completed',
            orderId: session.id
          });
          await payment.save();

          // Clear the user's cart
          await Cart.findOneAndUpdate(
            { userId },
            { $set: { items: [] } }
          );
        } catch (error) {
          console.error('Error saving payment:', error);
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
