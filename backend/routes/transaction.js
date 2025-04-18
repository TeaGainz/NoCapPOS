import express from "express";
import { createTransaction, getTransactions } from "../controllers/transaction.js";

const router = express.Router();

router.post("/", createTransaction); // Create a new transaction
router.get("/", getTransactions); // Get all transactions

export default router;