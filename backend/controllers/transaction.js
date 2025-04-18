import Product from "../models/products.js"; // Import the Product model
import Transaction from "../models/transaction.js"; // Import the Transaction model

export const createTransaction = async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || items.length === 0 || !totalAmount) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  try {
    // Generate a unique invoice number
    const invoiceNo = Date.now().toString() + Math.floor(Math.random() * 1000);

    const transaction = new Transaction({
      invoiceNo,
      items,
      totalAmount,
    });

    // Save the transaction
    await transaction.save();

    // Update the stock and sold fields for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: { quantity: -item.quantity, sold: item.quantity }, // Decrease stock and increase sold
        },
        { new: true }
      );
    }

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    console.error("Error creating transaction:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
