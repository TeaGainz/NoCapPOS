import Product from "../models/products.js";
import Keyboard from "../models/products/keyboard.js"
import Switches from "../models/products/switches.js"
import Keycaps from "../models/products/keycaps.js"
import Others from "../models/products/others.js"

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

// Get Best-Selling keeb
export const getBestSellingKeyboards = async (req, res) => {
  try {
    // Fetch products with sold > 0, sorted by sold in descending order
    const bestSellingKeyboards = await Keyboard.find({ sold: { $gt: 0 } })
      .sort({ sold: -1 })
      .limit(3); // Adjust for how many items to display as in top 3 ba or top 5 idc
    res.status(200).json({ success: true, data: bestSellingKeyboards });
  } catch (error) {
    console.error("Error fetching best-selling keyboards:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Low-Stock keeb
export const getLowStockKeyboards = async (req, res) => {
try {
  const lowStockKeyboards = await Keyboard.find({ quantity: { $lt: 10 } }).sort({ quantity: 1 }); // Adjust "$lt" for low stock treshold
  res.status(200).json({ success: true, data: lowStockKeyboards });
} catch (error) {
  console.error("Error fetching low-stock keyboards:", error.message);
  res.status(500).json({ success: false, message: "Server error" });
}
};

// Get Best-Selling switches
export const getBestSellingSwitches = async (req, res) => {
  try {
    // Fetch products with sold > 0, sorted by sold in descending order
    const bestSellingSwitches = await Switches.find({ sold: { $gt: 0 } })
      .sort({ sold: -1 })
      .limit(3); // Adjust for how many items to display as in top 3 ba or top 5 idc
    res.status(200).json({ success: true, data: bestSellingSwitches });
  } catch (error) {
    console.error("Error fetching best-selling switches:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Low-Stock switches
export const getLowStockSwitches = async (req, res) => {
try {
  const lowStockSwitches = await Switches.find({ quantity: { $lt: 10 } }).sort({ quantity: 1 }); // Adjust "$lt" for low stock treshold
  res.status(200).json({ success: true, data: lowStockSwitches });
} catch (error) {
  console.error("Error fetching low-stock switches:", error.message);
  res.status(500).json({ success: false, message: "Server error" });
}
};

// Get Best-Selling Keycaps
export const getBestSellingKeycaps = async (req, res) => {
  try {
    // Fetch products with sold > 0, sorted by sold in descending order
    const bestSellingKeycaps = await Keycaps.find({ sold: { $gt: 0 } })
      .sort({ sold: -1 })
      .limit(3); // Adjust for how many items to display as in top 3 ba or top 5 idc
    res.status(200).json({ success: true, data: bestSellingKeycaps });
  } catch (error) {
    console.error("Error fetching best-selling Keycaps:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Low-Stock Keycaps
export const getLowStockKeycaps = async (req, res) => {
try {
  const lowStockKeycaps = await Keycaps.find({ quantity: { $lt: 10 } }).sort({ quantity: 1 }); // Adjust "$lt" for low stock treshold
  res.status(200).json({ success: true, data: lowStockKeycaps });
} catch (error) {
  console.error("Error fetching low-stock Keycaps:", error.message);
  res.status(500).json({ success: false, message: "Server error" });
}
};

// Get Best-Selling Others
export const getBestSellingOthers = async (req, res) => {
  try {
    // Fetch products with sold > 0, sorted by sold in descending order
    const bestSellingOthers = await Others.find({ sold: { $gt: 0 } })
      .sort({ sold: -1 })
      .limit(3); // Adjust for how many items to display as in top 3 ba or top 5 idc
    res.status(200).json({ success: true, data: bestSellingOthers });
  } catch (error) {
    console.error("Error fetching best-selling Others:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Low-Stock Others
export const getLowStockOthers = async (req, res) => {
try {
  const lowStockOthers = await Others.find({ quantity: { $lt: 10 } }).sort({ quantity: 1 }); // Adjust "$lt" for low stock treshold
  res.status(200).json({ success: true, data: lowStockOthers });
} catch (error) {
  console.error("Error fetching low-stock Others:", error.message);
  res.status(500).json({ success: false, message: "Server error" });
}
};