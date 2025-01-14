import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Order from '../models/Order';

interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId;
  };
}

export const getAllOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log('Fetching all orders...');
    const orders = await Order.find()
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    console.log('Orders found:', orders);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid order status' });
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};
