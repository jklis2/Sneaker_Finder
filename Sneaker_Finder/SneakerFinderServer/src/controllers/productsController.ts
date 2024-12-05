import { Request, Response } from "express";
import Stockx from "../models/StockX";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Stockx.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};
