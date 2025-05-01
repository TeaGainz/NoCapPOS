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

  if (
    !switches.brand ||
    !switches.name ||
    !switches.description ||
    !switches.releaseYear ||
    !switches.switchType ||
    !switches.isFactoryLubed ||
    !switches.switchProfile ||
    !switches.actuationForce ||
    !switches.bottomOutForce ||
    !switches.preTravel ||
    !switches.totalTravel ||
    !switches.pins ||
    !switches.isHallEffect ||
    !switches.topHousingMaterial ||
    !switches.bottomHousingMaterial ||
    !switches.stemMaterial ||
    !switches.springs ||
    !switches.isLongPole ||
    !switches.price ||
    !switches.quantity ||
    !switches.image ||
    !switches.category
  ) {
    return res.status(400).json({ message: "Certain Fields are required" });
  }

  // Validate Base64 image size (e.g., limit to 2MB)
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  if (getBase64Size(switches.image) > MAX_IMAGE_SIZE) {
    return res
      .status(400)
      .json({ success: false, message: "Image size exceeds 2MB." });
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
    return res
      .status(400)
      .json({ success: false, message: "Invalid switches ID" });
  }

  // Validate Base64 image size (e.g., limit to 2MB)
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  const getBase64Size = (base64String) => {
    const padding = (base64String.match(/=/g) || []).length;
    const sizeInBytes = (base64String.length * 3) / 4 - padding;
    return sizeInBytes;
  };

  if (switches.image && getBase64Size(switches.image) > MAX_IMAGE_SIZE) {
    return res
      .status(400)
      .json({ success: false, message: "Image size exceeds 2MB." });
  }

  try {
    const updatedSwitches = await Switches.findByIdAndUpdate(id, switches, {
      new: true,
    });
    if (!updatedSwitches) {
      return res
        .status(404)
        .json({ success: false, message: "Switches not found" });
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
    return res.status(400).json({ success: false, message: "Invalid switches ID" });
  }

  try {
    const switches = await Switches.findById(id);
    if (!switches) {
      return res.status(404).json({ success: false, message: "Switches not found" });
    }
    if (switches.quantity < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }
    switches.quantity -= quantity;
    await switches.save();
    res.status(200).json({ success: true, data: switches });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};