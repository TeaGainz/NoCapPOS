import mongoose from "mongoose";
import Others from "../models/products/others.js";


// Helper function to calculate Base64 image size
const getBase64Size = (base64String) => {
  const padding = (base64String.match(/=/g) || []).length;
  const sizeInBytes = (base64String.length * 3) / 4 - padding;
  return sizeInBytes;
};

export const addOthers = async (req, res) => {
  const others = req.body;

  if (
    !others.brand ||
    !others.name ||
    !others.description ||
    !others.price ||
    !others.quantity ||
    !others.image ||
    !others.category
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Validate Base64 image size (e.g., limit to 2MB)
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  if (getBase64Size(others.image) > MAX_IMAGE_SIZE) {
    return res
      .status(400)
      .json({ success: false, message: "Image size exceeds 2MB." });
  }

  const newothers = new Others(others);

  try {
    await newOthers.save();
    res.status(201).json({ success: true, data: newOthers });
  } catch (error) {
    console.error("Error creating others", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOthers = async (req, res) => {
  try {
    const others = await Others.find({});
    if (!others || others.length === 0) {
      return res.status(404).json({ success: false, message: "No others" });
    }
    res.status(200).json({ success: true, data: others });
  } catch (error) {
    console.error("Error fetching others", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getOthersById = async (req, res) => {
  const { id } = req.params;

  try {
    const others = await Others.findById(id);
    if (!others) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: others });
  } catch (error) {
    console.error("Error fetching products", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOthers = async (req, res) => {
  const { id } = req.params;
  const others = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  // Validate Base64 image size (e.g., limit to 2MB)
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  const getBase64Size = (base64String) => {
    const padding = (base64String.match(/=/g) || []).length;
    const sizeInBytes = (base64String.length * 3) / 4 - padding;
    return sizeInBytes;
  };

  if (others.image && getBase64Size(others.image) > MAX_IMAGE_SIZE) {
    return res
      .status(400)
      .json({ success: false, message: "Image size exceeds 2MB." });
  }

  try {
    const updatedOthers = await Others.findByIdAndUpdate(id, others, {
      new: true,
    });
    if (!updatedOthers) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: updatedOthers });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteOthers = async (req, res) => {
  const { id } = req.params;

  try {
    const others = await Others.findByIdAndDelete(id);
    if (!others) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: others });
  } catch (error) {
    console.error("Error deleting product", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOthersSales = async (req, res) => {
  const { id } = req.params;
  const { sold } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  try {
    const others = await Others.findById(id);

    if (!others) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Increment the sold field
    others.sold += sold;

    const updatedOthers = await others.save();
    res.status(200).json({ success: true, data: updatedOthers });
  } catch (error) {
    console.error("Error updating product sales:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};