import { Request, Response } from "express";
import Cart from "../models/Cart";
import Order, { IOrder } from "../models/Order";
import Stripe from 'stripe';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

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

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Get user's shipping address from request body
    const { shippingAddress } = req.body;
    if (!shippingAddress) {
      res.status(400).json({ message: "Shipping address is required" });
      return;
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const order = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      orderNumber,
      date: new Date(),
      status: 'pending',
      products: cart.items.map(item => ({
        name: item.name,
        size: item.size || 'N/A',
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount,
      paymentId: 'pending',
      shippingAddress: {
        street: shippingAddress.street || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || shippingAddress.province || '',
        zipCode: shippingAddress.zipCode || shippingAddress.postalCode || '',
        country: shippingAddress.country || 'Poland'
      }
    });

    await order.save();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NODE_ENV === 'production' ? 'https://sneaker-finder-client-8cb4.onrender.com' : 'http://localhost:5001'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NODE_ENV === 'production' ? 'https://sneaker-finder-client-8cb4.onrender.com' : 'http://localhost:5001'}/cart`,
      metadata: {
        userId: userId,
        orderId: order._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
