import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    role?: 'admin' | 'user';
  };
}

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Access denied. Admin privileges required.' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error checking admin privileges' });
  }
};
