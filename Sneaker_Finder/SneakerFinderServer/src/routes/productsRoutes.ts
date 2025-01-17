import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  editProduct,
  addProduct,
  deleteProduct
} from "../controllers/productsController";

const router: Router = Router();

// GET /api/products
router.get("/", getAllProducts);
// GET /api/products/:id
router.get("/:id", getProductById);
// PUT /api/products/:id
router.put("/:id", editProduct);
// POST /api/products
router.post("/", addProduct);
// DELETE /api/products/:id
router.delete("/:id", deleteProduct);

export default router;
