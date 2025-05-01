import mongoose from "mongoose";
import Keyboard from "../models/products/keyboard.js";


// Helper function to calculate Base64 image size
const getBase64Size = (base64String) => {
  const padding = (base64String.match(/=/g) || []).length;
  const sizeInBytes = (base64String.length * 3) / 4 - padding;
  return sizeInBytes;
};

export const addKeyboard = async (req, res) => {
  const keyboard = req.body;

  if (
    !keyboard.brand ||
    !keyboard.name ||
    !keyboard.description ||
    !keyboard.price ||
    !keyboard.quantity ||
    !keyboard.image ||
    !keyboard.category
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Validate Base64 image size (e.g., limit to 2MB)
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  if (getBase64Size(keyboard.image) > MAX_IMAGE_SIZE) {
    return res
      .status(400)
      .json({ success: false, message: "Image size exceeds 2MB." });
  }

  const newKeyboard = new Keyboard(keyboard);

  try {
    await newKeyboard.save();
    res.status(201).json({ success: true, data: newKeyboard });
  } catch (error) {
    console.error("Error creating keyboard", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
  
};

export const getKeyboard = async (req, res) => {
  try {
    const keyboard = await Keyboard.find({});
    if (!keyboard || keyboard.length === 0) {
      return res.status(404).json({ success: false, message: "No keyboards found" });
    }
    res.status(200).json({ success: true, data: keyboard });
  } catch (error) {
    console.error("Error fetching keyboards", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getKeyboardById = async (req, res) => {
  const { id } = req.params;

  try {
    const keyboard = await Keyboard.findById(id);
    if (!keyboard) {
      return res
        .status(404)
        .json({ success: false, message: "Keyboard not found" });
    }
    res.status(200).json({ success: true, data: keyboard });
  } catch (error) {
    console.error("Error fetching keyboard", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateKeyboard = async (req, res) => {
  const { id } = req.params;
  const keyboard = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid keyboard ID" });
  }

  // Validate Base64 image size (e.g., limit to 2MB)
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  const getBase64Size = (base64String) => {
    const padding = (base64String.match(/=/g) || []).length;
    const sizeInBytes = (base64String.length * 3) / 4 - padding;
    return sizeInBytes;
  };

  if (keyboard.image && getBase64Size(keyboard.image) > MAX_IMAGE_SIZE) {
    return res
      .status(400)
      .json({ success: false, message: "Image size exceeds 2MB." });
  }

  try {
    const updatedKeyboard = await Keyboard.findByIdAndUpdate(id, keyboard, {
      new: true,
    });
    if (!updatedKeyboard) {
      return res
        .status(404)
        .json({ success: false, message: "Keyboard not found" });
    }
    res.status(200).json({ success: true, data: updateKeyboard });
  } catch (error) {
    console.error("Error updating keyboard:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteKeyboard = async (req, res) => {
  const { id } = req.params;

  try {
    const keyboard = await Keyboard.findByIdAndDelete(id);
    if (!keyboard) {
      return res
        .status(404)
        .json({ success: false, message: "Keyboard not found" });
    }
    res.json({ success: true, data: keyboard });
  } catch (error) {
    console.error("Error deleting keyboard", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateKeyboardSales = async (req, res) => {
  const { id } = req.params;
  const { sold } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid keyboard ID" });
  }

  try {
    const keyboard = await Keyboard.findById(id);

    if (!keyboard) {
      return res
        .status(404)
        .json({ success: false, message: "Keyboard not found" });
    }

    // Increment the sold field
    keyboard.sold += sold;

    const updatedKeyboard = await keyboard.save();
    res.status(200).json({ success: true, data: updatedKeyboard });
  } catch (error) {
    console.error("Error updating keyboard sales:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const decrementKeyboardStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid keyboard ID" });
  }

  try {
    const keyboard = await Keyboard.findById(id);
    if (!keyboard) {
      return res.status(404).json({ success: false, message: "Keyboard not found" });
    }
    if (keyboard.quantity < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }
    keyboard.quantity -= quantity;
    await keyboard.save();
    res.status(200).json({ success: true, data: keyboard });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
