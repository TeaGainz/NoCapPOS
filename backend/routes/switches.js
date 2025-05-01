import express from "express";
import {
  addSwitches,
  deleteSwitches,
  getSwitchesById,
  getSwitches,
  updateSwitches,
  decrementSwitchesStock,
} from "../controllers/switches.js";
import { updateSwitchesSales } from "../controllers/switches.js";

const router = express.Router();

router.use(express.json());

router.post("/", addSwitches);

router.get("/", getSwitches);

router.get("/:id", getSwitchesById);

router.put("/:id", updateSwitches);

router.delete("/:id", deleteSwitches);

router.patch("/:id/sales", updateSwitchesSales);

router.patch("/:id/decrement", decrementSwitchesStock);

export default router;
