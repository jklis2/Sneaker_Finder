import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
  editProduct,
  deleteProduct,
} from "../controllers/productsController";
import { protect, optionalAuth } from "../middleware/authMiddleware";

const router: Router = Router();

// Public routes with optional auth
router.get("/", optionalAuth, getAllProducts);
router.get("/:id", optionalAuth, getProductById);

// Protected routes - require auth
router.post("/", protect, addProduct);
router.put("/:id", protect, editProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
