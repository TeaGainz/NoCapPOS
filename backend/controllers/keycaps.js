import mongoose from "mongoose";
import Keycaps from "../models/products/keycaps.js";


// Helper function to calculate Base64 image size
const getBase64Size = (base64String) => {
  const padding = (base64String.match(/=/g) || []).length;
  const sizeInBytes = (base64String.length * 3) / 4 - padding;
  return sizeInBytes;
};

export const addKeycaps = async (req, res) => {
  const keycaps = req.body;

  if (
    !keycaps.brand ||
    !keycaps.name ||
    !keycaps.description ||
    !keycaps.profile ||
    !keycaps.material ||
    !keycaps.layoutStandard ||
    !keycaps.subLegends ||
    !keycaps.rgbShineThrough ||
    !keycaps.price ||
    !keycaps.quantity ||
    !keycaps.image ||
    !keycaps.category
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Validate Base64 image size (e.g., limit to 2MB)
  const MAX_IMAGE_SIZE = 15 * 1920 * 1080; // ~30MB in bytes
  if (getBase64Size(keycaps.image) > MAX_IMAGE_SIZE) {
    return res
      .status(400)
      .json({ success: false, message: "Image size exceeds 2MB." });
  }

  const newKeycaps = new Keycaps(keycaps);

  try {
    await newKeycaps.save();
    res.status(201).json({ success: true, data: newKeycaps });
  } catch (error) {
    console.error("Error creating keycaps", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getKeycaps = async (req, res) => {
  try {
    const keycaps = await Keycaps.find({});
    if (!keycaps || keycaps.length === 0) {
      return res.status(404).json({ success: false, message: "No keycaps" });
    }
    res.status(200).json({ success: true, data: keycaps });
  } catch (error) {
    console.error("Error fetching keycaps", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getKeycapsById = async (req, res) => {
  const { id } = req.params;

  try {
    const keycaps = await Keycaps.findById(id);
    if (!keycaps) {
      return res
        .status(404)
        .json({ success: false, message: "Keycaps not found" });
    }
    res.status(200).json({ success: true, data: keycaps });
  } catch (error) {
    console.error("Error fetching keycaps", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateKeycaps = async (req, res) => {
  const { id } = req.params;
  const keycaps = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid keycaps ID" });
  }

  // Validate Base64 image size (e.g., limit to 2MB)
  const MAX_IMAGE_SIZE = 15 * 1920 * 1080; // ~30MB in bytes
  const getBase64Size = (base64String) => {
    const padding = (base64String.match(/=/g) || []).length;
    const sizeInBytes = (base64String.length * 3) / 4 - padding;
    return sizeInBytes;
  };

  if (keycaps.image && getBase64Size(keycaps.image) > MAX_IMAGE_SIZE) {
    return res
      .status(400)
      .json({ success: false, message: "Image size exceeds 2MB." });
  }

  try {
    const updatedKeycaps = await Keycaps.findByIdAndUpdate(id, keycaps, {
      new: true,
    });
    if (!updatedKeycaps) {
      return res
        .status(404)
        .json({ success: false, message: "Keycaps not found" });
    }
    res.status(200).json({ success: true, data: updatedKeycaps });
  } catch (error) {
    console.error("Error updating keycaps:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteKeycaps= async (req, res) => {
  const { id } = req.params;

  try {
    const keycaps = await Keycaps.findByIdAndDelete(id);
    if (!keycaps) {
      return res
        .status(404)
        .json({ success: false, message: "Keycaps not found" });
    }
    res.json({ success: true, data: keycaps });
  } catch (error) {
    console.error("Error deleting keycaps", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateKeycapsSales = async (req, res) => {
  const { id } = req.params;
  const { sold } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid keycaps ID" });
  }

  try {
    const keycaps = await Keycaps.findById(id);

    if (!keycaps) {
      return res
        .status(404)
        .json({ success: false, message: "Keycaps not found" });
    }

    // Increment the sold field
    keycaps.sold += sold;

    const updatedKeycaps = await keycaps.save();
    res.status(200).json({ success: true, data: updatedKeycaps });
  } catch (error) {
    console.error("Error updating keycaps sales:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const decrementKeycapsStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid keycaps ID" });
  }

  try {
    const keycaps = await Keycaps.findById(id);
    if (!keycaps) {
      return res.status(404).json({ success: false, message: "Keycaps not found" });
    }
    if (keycaps.quantity < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }
    keycaps.quantity -= quantity;
    await keycaps.save();
    res.status(200).json({ success: true, data: keycaps });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};