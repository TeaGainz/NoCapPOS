import express from "express";
import { getBestSellingItems, getLowStockItems } from "../controllers/analytics.js";

const router = express.Router();

router.get("/best-selling", getBestSellingItems); // Endpoint for best-selling items
router.get("/low-stock", getLowStockItems); // Endpoint for low-stock items

export default router;