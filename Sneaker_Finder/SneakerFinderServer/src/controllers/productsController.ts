import { Request, Response } from "express";
import Stockx from "../models/StockX";
import mongoose from "mongoose";

export const getAllProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Stockx.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductById = async (
  req: Request,
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

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
};
