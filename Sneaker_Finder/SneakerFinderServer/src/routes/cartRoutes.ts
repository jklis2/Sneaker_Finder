import express from "express";
import asyncHandler from "express-async-handler";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cartController";

const router = express.Router();

router.get("/", asyncHandler(getCart));
router.post("/add", asyncHandler(addToCart));
router.put("/update", asyncHandler(updateCartItem));
router.delete("/remove", asyncHandler(removeFromCart));
router.delete("/clear", asyncHandler(clearCart));

export default router;
