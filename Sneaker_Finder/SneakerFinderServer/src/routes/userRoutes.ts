import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  addShippingAddress,
  getShippingAddresses,
  updateShippingAddress,
  deleteShippingAddress,
  updateUserEmail,
  updateUserPassword,
  uploadProfilePicture,
  registerAdmin
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";
import { getUserPayments } from '../controllers/paymentController';

const router = express.Router();

// Public routes
router.post("/register", asyncHandler(registerUser));
router.post("/register-admin", asyncHandler(registerAdmin));
router.post("/login", asyncHandler(loginUser));

// Protected routes
router.get("/me", protect, asyncHandler(getCurrentUser));
router.put("/me/email", protect, asyncHandler(updateUserEmail));
router.put("/me/password", protect, asyncHandler(updateUserPassword));
router.post("/me/profile-picture", protect, upload.single('profilePicture'), asyncHandler(uploadProfilePicture));
router.get("/me/addresses", protect, asyncHandler(getShippingAddresses));
router.post("/me/addresses", protect, asyncHandler(addShippingAddress));
router.put("/me/addresses/:addressIndex", protect, asyncHandler(updateShippingAddress));
router.delete("/me/addresses/:addressIndex", protect, asyncHandler(deleteShippingAddress));
router.get('/orders', asyncHandler(getUserPayments));

export default router;
