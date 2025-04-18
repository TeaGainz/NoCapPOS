import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now, // Automatically set the transaction date
    },
    invoiceNo: {
      type: String,
      required: true,
      unique: true, // Ensure invoice numbers are unique
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    status: {
      type: String,
      enum: ["Paid", "Expired"],
      default: "Paid",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;