import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/products.js";
import analyticsRoutes from "./routes/analytics.js";
import transactionRoutes from "./routes/transaction.js";
import keyboardRoutes from "./routes/keyboard.js";
import switchesRoutes from "./routes/switches.js";
import keycapsRoutes from "./routes/keycaps.js";
import othersRoutes from "./routes/others.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/keyboard", keyboardRoutes);
app.use("/api/switches", switchesRoutes);
app.use("/api/keycaps", keycapsRoutes);
app.use("/api/others", othersRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/transactions", transactionRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on http://localhost:" + PORT);
});
