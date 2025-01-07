import { Request, Response } from 'express';
import Stripe from 'stripe';
import mongoose, { Document } from 'mongoose';
import Payment from '../models/Payment';
import Cart from '../models/Cart';
import { createOrder } from './orderController';
import dotenv from 'dotenv';

interface PaymentDocument extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: string;
  status: string;
  orderId: string;
  createdAt: Date;
}

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Function to process the order asynchronously
async function processOrder(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.userId;
    if (!userId) {
      console.error('No userId in session metadata');
      return;
    }

    // Create payment record
    const payment = await Payment.create({
      userId: new mongoose.Types.ObjectId(userId),
      amount: session.amount_total ? session.amount_total / 100 : 0,
      paymentMethod: 'card',
      status: 'completed',
      orderId: session.id
    }) as PaymentDocument;

    console.log('Payment record created:', payment._id);

    // Get cart and create order
    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.items.length) {
      console.error('No cart found or empty cart for user:', userId);
      return;
    }

    // Create the order
    await createOrder(
      userId,
      payment._id.toString(),
      cart.items,
      payment.amount
    );

    console.log('Order created successfully');

    // Clear the cart
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } }
    );

    console.log('Cart cleared');
  } catch (error) {
    console.error('Error processing order:', error);
  }
}

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  console.log('Received webhook event');
  const sig = req.headers['stripe-signature'];
  if (!sig || !endpointSecret) {
    console.error('No signature or endpoint secret');
    res.status(400).send('Webhook Error: No signature');
    return;
  }

  let event: Stripe.Event;

  try {
    // Get the raw body from the request
    const rawBody = req.body;
    
    if (!Buffer.isBuffer(rawBody)) {
      console.error('Request body is not a buffer:', typeof rawBody);
      throw new Error('Request body must be raw buffer');
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    console.log('Webhook event constructed successfully');
    console.log('Event type:', event.type);
  } catch (err) {
    console.error('Error constructing webhook event:', err);
    res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return;
  }

  // Respond to Stripe immediately
  res.json({ received: true });

  // Process the event asynchronously
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Processing checkout session:', session.id);
        // Process the order asynchronously
        processOrder(session).catch(error => {
          console.error('Error in async order processing:', error);
        });
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent succeeded:', paymentIntent.id);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
  }
};
