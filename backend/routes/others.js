import express from "express";
import {
  addOthers,
  deleteOthers,
  getOthersById,
  getOthers,
  updateOthers,
  decrementOthersStock,
} from "../controllers/others.js";
import { updateOthersSales } from "../controllers/others.js";

const router = express.Router();

router.use(express.json());

router.post("/", addOthers);

router.get("/", getOthers);

router.get("/:id", getOthersById);

router.put("/:id", updateOthers);

router.delete("/:id", deleteOthers);

router.patch("/:id/sales", updateOthersSales);

router.patch("/:id/decrement", decrementOthersStock);

export default router;
