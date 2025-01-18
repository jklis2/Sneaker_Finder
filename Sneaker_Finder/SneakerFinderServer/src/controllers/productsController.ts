import { Request, Response } from "express";
import Stockx from "../models/StockX";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId;
    role?: 'admin' | 'user';
  };
}

export const getAllProducts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // If user is logged in and is admin, show all products
    // Otherwise, only show available products
    const isAdmin = req.user?.role === 'admin';
    const query = isAdmin ? {} : { availability: 'available' };
    
    const products = await Stockx.find(query);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid product ID format" });
      return;
    }

    const product = await Stockx.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // If user is not admin and product is not available, return 404
    if (req.user?.role !== 'admin' && product.availability !== 'available') {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

export const addProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Only admin can add products
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const { name, price, brand, color, imageUrl, availableSizes } = req.body;

    if (!name || !price) {
      res.status(400).json({ message: "Name and price are required fields" });
      return;
    }

    const newProduct = new Stockx({
      name,
      price,
      brand,
      color,
      imageUrl,
      availableSizes,
      availability: 'available'
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product" });
  }
};

export const editProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Only admin can edit products
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid product ID format" });
      return;
    }

    const updatedProduct = await Stockx.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Only admin can delete products
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid product ID format" });
      return;
    }

    const deletedProduct = await Stockx.findByIdAndDelete(id);

    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};
