import express from "express";
import {
  addKeycaps,
  deleteKeycaps,
  getKeycapsById,
  getKeycaps,
  updateKeycaps,
} from "../controllers/keycaps.js";
import { updateKeycapsSales } from "../controllers/keycaps.js";

const router = express.Router();

router.use(express.json());

router.post("/", addKeycaps);

router.get("/", getKeycaps);

router.get("/:id", getKeycapsById);

router.put("/:id", updateKeycaps);

router.delete("/:id", deleteKeycaps);

router.patch("/:id/sales", updateKeycapsSales);

export default router;
