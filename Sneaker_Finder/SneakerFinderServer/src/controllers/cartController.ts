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
    const { userId, productId, name, price, size } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        total: 0
      });
    }

    // Check for existing item with same productId AND size
    const existingItem = cart.items.find(item => 
      item.productId === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId,
        name,
        price,
        quantity: 1,
        size
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
    const { userId, productId, quantity, size } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const item = cart.items.find(item => 
      item.productId === productId && item.size === size
    );
    if (!item) {
      res.status(404).json({ message: "Item not found in cart" });
      return;
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => 
        !(item.productId === productId && item.size === size)
      );
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
    const { userId, productId, size } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    cart.items = cart.items.filter(item => 
      !(item.productId === productId && item.size === size)
    );
    await cart.save();
    res.json(cart);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

// Clear cart
export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], total: 0 } }
    );

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
