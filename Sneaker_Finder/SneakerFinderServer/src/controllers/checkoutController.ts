import { Request, Response } from "express";
import Cart from "../models/Cart";

export const getCheckoutInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    // Transform cart data for checkout display
    const checkoutData = {
      items: cart.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      total: cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    res.json(checkoutData);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
