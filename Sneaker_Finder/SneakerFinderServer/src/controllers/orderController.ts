import { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import mongoose from 'mongoose';

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

export const createOrder = async (
  userId: string,
  paymentId: string,
  cartItems: any[],
  totalAmount: number
): Promise<void> => {
  try {
    console.log('Creating order for user:', userId);
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const order = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      orderNumber,
      date: new Date(),
      status: 'completed',
      products: cartItems.map(item => ({
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
