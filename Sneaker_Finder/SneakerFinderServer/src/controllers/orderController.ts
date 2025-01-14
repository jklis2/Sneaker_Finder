import { Request, Response } from 'express';
import Order, { IOrder } from '../models/Order';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia'
});

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Getting orders for user:', req.user?._id);
    const userId = req.user?._id;
    if (!userId) {
      console.error('No user ID found in request');
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ date: -1 });
    console.log('Found orders:', orders.length);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const getOrderBySessionId = async (req: Request, res: Response): Promise<void> => {
  const { sessionId } = req.params;

  if (!sessionId) {
    res.status(400).json({ message: 'Session ID is required' });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.metadata || !session.metadata.orderId) {
      res.status(404).json({ message: 'Order ID not found in session metadata' });
      return;
    }

    const orderId = session.metadata.orderId as string;

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Error fetching session' });
  }
};

export const createOrder = async (
  userId: string,
  paymentId: string,
  cartItems: any[],
  totalAmount: number
): Promise<void> => {
  try {
    console.log('Creating order for user:', userId);
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order: IOrder = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      orderNumber,
      date: new Date(),
      status: 'pending',
      products: cartItems.map((item: any) => ({
        name: item.name,
        size: item.size || 'N/A',
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount,
      paymentId
    });

    await order.save();
    console.log('Order created successfully:', order.orderNumber);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
