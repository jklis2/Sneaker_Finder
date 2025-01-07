import { Request, Response } from "express";
import Cart from "../models/Cart";
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia'
});

export const getCheckoutInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    // Transform cart data for checkout display
    const checkoutData = {
      items: cart.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      total: cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    res.json(checkoutData);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    // Create line items for Stripe
    const lineItems = cart.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NODE_ENV === 'production' ? 'https://sneaker-finder-client-8cb4.onrender.com/api' : 'http://localhost:5001'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NODE_ENV === 'production' ? 'https://sneaker-finder-client-8cb4.onrender.com/api' : 'http://localhost:5001'}/cart`,
      metadata: {
        userId: userId,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
