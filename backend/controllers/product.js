import mongoose from "mongoose";
import Product from "../models/products.js";


// Helper function to calculate Base64 image size
const getBase64Size = (base64String) => {
  const padding = (base64String.match(/=/g) || []).length;
  const sizeInBytes = (base64String.length * 3) / 4 - padding;
  return sizeInBytes;
};

export const addProduct = async (req, res) => {
  const product = req.body;

  if (
    !product.brand ||
    !product.name ||
    !product.description ||
    !product.price ||
    !product.quantity ||
    !product.image ||
    !product.category
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Validate Base64 image size (e.g., limit to 2MB)
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
  if (getBase64Size(product.image) > MAX_IMAGE_SIZE) {
    return res
      .status(400)
      .json({ success: false, message: "Image size exceeds 2MB." });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products" });
    }
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching products", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

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

  if (product.image && getBase64Size(product.image) > MAX_IMAGE_SIZE) {
    return res
      .status(400)
      .json({ success: false, message: "Image size exceeds 2MB." });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error("Error deleting product", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProductSales = async (req, res) => {
  const { id } = req.params;
  const { sold } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Increment the sold field
    product.sold += sold;

    const updatedProduct = await product.save();
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product sales:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};