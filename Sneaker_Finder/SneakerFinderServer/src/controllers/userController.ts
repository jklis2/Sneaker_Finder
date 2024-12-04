import { Request, Response } from "express";
import User from "../models/User";

export const registerUser = async (
  req: Request,
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

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: "Please provide both email and password" });
      return;
    }

    console.log("Login attempt for email:", email);
    const user = await User.findOne({ email });
    
    if (!user) {
      res.status(401).json({ message: "User not found with this email" });
      return;
    }

    const isMatch = await user.matchPassword(password);
    console.log("Password match result:", isMatch);
    
    if (isMatch) {
      res.json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: "temporary-token" // You should implement proper JWT token here
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
