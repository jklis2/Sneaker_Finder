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
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
