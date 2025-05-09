import express from "express";
import {
  addKeyboard,
  deleteKeyboard,
  getKeyboardById,
  getKeyboard,
  updateKeyboard,
  decrementKeyboardStock
} from "../controllers/keyboard.js";
import { updateKeyboardSales } from "../controllers/keyboard.js";

const router = express.Router();

router.use(express.json());

router.post("/", addKeyboard);

router.get("/", getKeyboard);

router.get("/:id", getKeyboardById);

router.put("/:id", updateKeyboard);

router.delete("/:id", deleteKeyboard);

router.patch("/:id/sales", updateKeyboardSales);

router.patch("/:id/decrement", decrementKeyboardStock);

export default router;
