import express from "express";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.js";
import { updateProductSales } from "../controllers/product.js";

const router = express.Router();

router.use(express.json());

router.post("/", addProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

router.patch("/:id/sales", updateProductSales);

export default router;
