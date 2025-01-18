import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  editProduct,
  addProduct,
  deleteProduct
} from "../controllers/productsController";
import { protect } from "../middleware/authMiddleware";

const router: Router = Router();

// GET /api/products
router.get("/", protect, getAllProducts);
// GET /api/products/:id
router.get("/:id", protect, getProductById);
// PUT /api/products/:id
router.put("/:id", protect, editProduct);
// POST /api/products
router.post("/", protect, addProduct);
// DELETE /api/products/:id
router.delete("/:id", protect, deleteProduct);

export default router;
