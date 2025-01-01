import { Request, Response } from 'express';
import Payment from '../models/Payment';

export const confirmPayment = async (req: Request, res: Response): Promise<void> => {
  const { userId, amount, paymentMethod, status, orderId } = req.body;

  if (!userId || !amount || !paymentMethod || !status || !orderId) {
    res.status(400).json({ message: 'Missing payment details' });
    return;
  }

  try {
    const payment = new Payment({
      userId,
      amount,
      paymentMethod,
      status,
      orderId
    });

    await payment.save();
    res.status(201).json({ message: 'Payment confirmed and saved' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving payment', error });
  }
};

export const getUserPayments = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;

  if (!userId) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  try {
    const payments = await Payment.find({ userId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};
