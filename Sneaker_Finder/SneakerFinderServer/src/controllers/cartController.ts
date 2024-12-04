import { Request, Response } from "express";
import Cart from "../models/Cart";

// Get user's cart
export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string;
    const cart = await Cart.findOne({ userId });
    res.json(cart || { items: [], total: 0 });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, productId, name, price } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        total: 0
      });
    }

    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId,
        name,
        price,
        quantity: 1
      });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Update item quantity
export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const item = cart.items.find(item => item.productId === productId);
    if (!item) {
      res.status(404).json({ message: "Item not found in cart" });
      return;
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.productId !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    cart.items = cart.items.filter(item => item.productId !== productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
