import { Request, Response, Express } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary';

interface AuthRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId;
  };
  file?: Express.Multer.File;
}

const generateToken = (userId: mongoose.Types.ObjectId): string => {
  return jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

export const registerUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { firstName, lastName, email, gender, birthDate, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      gender,
      birthDate,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: "Please provide both email and password" });
      return;
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      res.status(401).json({ message: "User not found with this email" });
      return;
    }

    const isMatch = await user.matchPassword(password);
    
    if (isMatch) {
      const token = generateToken(user._id);
      res.json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token
      });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const addShippingAddress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const newAddress = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.shippingAddresses = user.shippingAddresses || [];
    user.shippingAddresses.push(newAddress);
    await user.save();

    res.status(201).json({ message: "Shipping address added successfully", address: newAddress });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const getShippingAddresses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ shippingAddresses: user.shippingAddresses || [] });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const deleteShippingAddress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const addressIndex = parseInt(req.params.addressIndex);
    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.shippingAddresses || addressIndex >= user.shippingAddresses.length) {
      res.status(404).json({ message: "Shipping address not found" });
      return;
    }

    user.shippingAddresses.splice(addressIndex, 1);
    await user.save();

    res.status(200).json({ message: "Shipping address deleted successfully" });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const updateShippingAddress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const addressIndex = parseInt(req.params.addressIndex);
    const updatedAddress = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.shippingAddresses || addressIndex >= user.shippingAddresses.length) {
      res.status(404).json({ message: "Shipping address not found" });
      return;
    }

    user.shippingAddresses[addressIndex] = updatedAddress;
    await user.save();

    res.status(200).json({ message: "Shipping address updated successfully", address: updatedAddress });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const updateUserEmail = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.email = email;
    await user.save();

    res.status(200).json({ message: "Email updated successfully", email: user.email });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const updateUserPassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: "Current password and new password are required" });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ message: "Current password is incorrect" });
      return;
    }

    // Update password - the pre-save hook in User model will hash it
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const uploadProfilePicture = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'profile_pictures',
      public_id: `user_${user._id}`,
    });

    // Update user's profile picture URL
    user.profilePicture = result.secure_url;
    await user.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: result.secure_url
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: "Error uploading profile picture" });
  }
};
