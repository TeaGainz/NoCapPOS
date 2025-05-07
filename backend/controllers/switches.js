import mongoose from "mongoose";
import Switches from "../models/products/switches.js";

// Helper function to calculate Base64 image size
const getBase64Size = (base64String) => {
  const padding = (base64String.match(/=/g) || []).length;
  const sizeInBytes = (base64String.length * 3) / 4 - padding;
  return sizeInBytes;
};

export const addSwitches = async (req, res) => {
  const switches = req.body;

  // Required field validation
  if (!switches.brand || !switches.name || !switches.description || 
      !switches.price || !switches.quantity || !switches.category) {
    return res.status(400).json({ message: "Basic fields are required" });
  }

  const MAX_IMAGE_SIZE = 15 * 1920 * 1080; // ~30MB in bytes

  // Helper function to validate image size
  const validateImage = (imageData) => {
    if (!imageData) return true; // Skip validation if no image
    return getBase64Size(imageData) <= MAX_IMAGE_SIZE;
  };

  // Validate all images
  const imageValidations = [
    { field: 'image', data: switches.image },
    { field: 'altImage', data: switches.altImage },
    { field: 'imageRender1', data: switches.imageRender1 },
    { field: 'imageRender2', data: switches.imageRender2 },
    { field: 'imageRender3', data: switches.imageRender3 },
    { field: 'imageRender4', data: switches.imageRender4 },
    { field: 'imageRender5', data: switches.imageRender5 },
    { field: 'imageRender6', data: switches.imageRender6 }
  ];

  for (const validation of imageValidations) {
    if (validation.data && !validateImage(validation.data)) {
      return res.status(400).json({
        success: false,
        message: `${validation.field} size exceeds 30MB.`
      });
    }
  }

  const newSwitches = new Switches(switches);

  try {
    await newSwitches.save();
    res.status(201).json({ success: true, data: newSwitches });
  } catch (error) {
    console.error("Error creating switches", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSwitches = async (req, res) => {
  try {
    const switches = await Switches.find({});
    if (!switches || switches.length === 0) {
      return res.status(404).json({ success: false, message: "No switches" });
    }
    res.status(200).json({ success: true, data: switches });
  } catch (error) {
    console.error("Error fetching switches", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSwitchesById = async (req, res) => {
  const { id } = req.params;

  try {
    const switches = await Switches.findById(id);
    if (!switches) {
      return res
        .status(404)
        .json({ success: false, message: "Switches not found" });
    }
    res.status(200).json({ success: true, data: switches });
  } catch (error) {
    console.error("Error fetching switches", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateSwitches = async (req, res) => {
  const { id } = req.params;
  const switches = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid switches ID" });
  }

  const MAX_IMAGE_SIZE = 15 * 1920 * 1080;

  // Helper function to validate image size
  const validateImage = (imageData) => {
    if (!imageData) return true; // Skip validation if no image
    return getBase64Size(imageData) <= MAX_IMAGE_SIZE;
  };

  // Validate all images
  const imageValidations = [
    { field: 'image', data: switches.image },
    { field: 'altImage', data: switches.altImage },
    { field: 'imageRender1', data: switches.imageRender1 },
    { field: 'imageRender2', data: switches.imageRender2 },
    { field: 'imageRender3', data: switches.imageRender3 },
    { field: 'imageRender4', data: switches.imageRender4 },
    { field: 'imageRender5', data: switches.imageRender5 },
    { field: 'imageRender6', data: switches.imageRender6 }
  ];

  for (const validation of imageValidations) {
    if (validation.data && !validateImage(validation.data)) {
      return res.status(400).json({
        success: false,
        message: `${validation.field} size exceeds 30MB.`
      });
    }
  }

  try {
    const updatedSwitches = await Switches.findByIdAndUpdate(id, switches, {
      new: true,
    });
    if (!updatedSwitches) {
      return res.status(404).json({ success: false, message: "Switches not found" });
    }
    res.status(200).json({ success: true, data: updatedSwitches });
  } catch (error) {
    console.error("Error updating switches:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteSwitches = async (req, res) => {
  const { id } = req.params;

  try {
    const switches = await Switches.findByIdAndDelete(id);
    if (!switches) {
      return res
        .status(404)
        .json({ success: false, message: "Switches not found" });
    }
    res.json({ success: true, data: switches });
  } catch (error) {
    console.error("Error deleting switches", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateSwitchesSales = async (req, res) => {
  const { id } = req.params;
  const { sold } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid switches ID" });
  }

  try {
    const switches = await Switches.findById(id);

    if (!switches) {
      return res
        .status(404)
        .json({ success: false, message: "Switches not found" });
    }

    // Increment the sold field
    switches.sold += sold;

    const updatedSwitches = await switches.save();
    res.status(200).json({ success: true, data: updatedSwitches });
  } catch (error) {
    console.error("Error updating switches sales:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const decrementSwitchesStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid switches ID" });
  }

  try {
    const switches = await Switches.findById(id);
    if (!switches) {
      return res
        .status(404)
        .json({ success: false, message: "Switches not found" });
    }
    if (switches.quantity < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough stock" });
    }
    switches.quantity -= quantity;
    await switches.save();
    res.status(200).json({ success: true, data: switches });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
