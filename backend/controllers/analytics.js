import Product from "../models/products.js";

// Get Best-Selling Items
export const getBestSellingItems = async (req, res) => {
    try {
      // Fetch products with sold > 0, sorted by sold in descending order
      const bestSellingItems = await Product.find({ sold: { $gt: 0 } })
        .sort({ sold: -1 })
        .limit(3); // Adjust for how many items to display as in top 3 ba or top 5 idc
      res.status(200).json({ success: true, data: bestSellingItems });
    } catch (error) {
      console.error("Error fetching best-selling items:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

// Get Low-Stock Items
export const getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Product.find({ quantity: { $lt: 10 } }).sort({ quantity: 1 }); // Adjust "$lt" for low stock treshold
    res.status(200).json({ success: true, data: lowStockItems });
  } catch (error) {
    console.error("Error fetching low-stock items:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};