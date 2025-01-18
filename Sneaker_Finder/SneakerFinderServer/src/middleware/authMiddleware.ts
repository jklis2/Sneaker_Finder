import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: mongoose.Types.ObjectId;
        role?: 'admin' | 'user';
      };
    }
  }
}

// Middleware to protect routes - requires valid token
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not configured');
      }

      // Verify token
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Get user from the token and set it on the request
      const user = await User.findById(decoded.userId).select('-password') as IUser | null;
      if (!user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      req.user = {
        _id: user._id,
        role: user.role
      };

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

// Middleware to optionally authenticate - doesn't require token
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not configured');
      }

      // Verify token
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Get user from the token and set it on the request
      const user = await User.findById(decoded.userId).select('-password') as IUser | null;
      if (user) {
        req.user = {
          _id: user._id,
          role: user.role
        };
      }
    } catch (error) {
      // Ignore token errors in optional auth
      console.error('Optional auth error:', error);
    }
  }

  next();
};
