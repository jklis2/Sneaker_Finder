import { Router } from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/productsController";

const router: Router = Router();

// GET /api/products
router.get("/", getAllProducts);
// GET /api/products/:id
router.get("/:id", getProductById);

export default router;
