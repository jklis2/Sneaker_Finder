import { Request, Response } from 'express';
import Payment from '../models/Payment';
import User from '../models/User';
import Order, { IOrder } from '../models/Order';
import { sendPaymentConfirmation } from '../services/emailService';
import { Types } from 'mongoose';

interface IOrderProduct {
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface IEmailOrderDetails {
  orderId: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export const confirmPayment = async (req: Request, res: Response): Promise<void> => {
  const { userId, amount, paymentMethod, status, orderId } = req.body;

  if (!userId || !amount || !paymentMethod || !status || !orderId) {
    res.status(400).json({ message: 'Missing payment details' });
    return;
  }

  try {
    const payment = new Payment({
      userId: new Types.ObjectId(userId),
      amount,
      paymentMethod,
      status,
      orderId: new Types.ObjectId(orderId)
    });

    await payment.save();

    // Get user email and order details
    const user = await User.findById(userId);
    const order = await Order.findById(orderId).lean() as IOrder | null;

    if (user && order) {
      const orderDetails: IEmailOrderDetails = {
        orderId: order._id.toString(),
        totalAmount: amount,
        items: order.products.map((product: IOrderProduct) => ({
          name: product.name,
          quantity: product.quantity,
          price: product.price
        }))
      };

      // Send confirmation email
      try {
        await sendPaymentConfirmation(user.email, orderDetails);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the payment if email fails
      }
    }

    res.status(201).json({ message: 'Payment confirmed and saved' });
  } catch (error) {
    console.error('Error in confirmPayment:', error);
    res.status(500).json({ message: 'Error saving payment', error });
  }
};

export const getUserPayments = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  try {
    const payments = await Payment.find({ userId: new Types.ObjectId(userId) });
    res.json(payments);
  } catch (error) {
    console.error('Error in getUserPayments:', error);
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};
