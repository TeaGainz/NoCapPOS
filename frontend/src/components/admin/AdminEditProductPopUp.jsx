import React, { useState } from "react";

const AdminEditProductPopUp = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    brand: product.brand,
    name: product.name,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    image: product.image,
    category: product.category,
    imageLink: "", // Optional field for entering a new image link
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use the uploaded image (Base64) if available, otherwise use the image link
    const finalImage = formData.image || formData.imageLink;

    if (!finalImage) {
      alert("Please upload an image or provide an image link.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${product._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, image: finalImage }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Product updated successfully!");
        onProductUpdated(data.data);
        onClose();
      } else {
        alert("Failed to update product: " + data.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex justify-center items-center relative overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

                  if (file) {
                    if (file.size > MAX_IMAGE_SIZE) {
                      alert(
                        "Image size exceeds 2MB. Please choose a smaller image."
                      );
                      return;
                    }

                    const reader = new FileReader();
                    reader.onload = () => {
                      setFormData({ ...formData, image: reader.result }); // Save the Base64 image
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {/* Image Preview or Placeholder */}
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Change Item Photo</span>
              )}
            </div>
          </div>

          {/* Or Enter Image Link */}
          <div>
            <label className="block font-bold mb-1">Or Enter Image Link:</label>
            <input
              type="text"
              name="imageLink"
              placeholder="Enter image URL"
              value={formData.imageLink}
              onChange={(e) => {
                const { name, value } = e.target;

                // Validate the URL format
                const isValidImageUrl = (url) => {
                  try {
                    // Create a URL object to validate the structure
                    const parsedUrl = new URL(url);

                    // Extract the file extension from the URL (ignoring query parameters)
                    const urlWithoutQuery = parsedUrl.pathname;
                    return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(
                      urlWithoutQuery
                    );
                  } catch {
                    return false; // Invalid URL structure
                  }
                };

                if (name === "imageLink" && value && !isValidImageUrl(value)) {
                  alert(
                    "Please enter a valid image URL (e.g., .jpg, .png, .gif)."
                  );
                  return;
                }

                setFormData({ ...formData, [name]: value });
              }}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block font-bold mb-1">Brand:</label>
            <input
              type="text"
              name="brand"
              placeholder="Enter brand"
              value={formData.brand}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block font-bold mb-1">Item Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter item name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Product Price */}
          <div>
            <label className="block font-bold mb-1">Item Price:</label>
            <input
              type="number"
              name="price"
              placeholder="Enter item price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Product Quantity */}
          <div>
            <label className="block font-bold mb-1">Item Stock:</label>
            <input
              type="number"
              name="quantity"
              placeholder="Enter item stock"
              value={formData.quantity}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Product Category */}
          <div>
            <label className="block font-bold mb-1">Category:</label>
            <input
              type="text"
              name="category"
              placeholder="Enter category"
              value={formData.category}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block font-bold mb-1">Item Description:</label>
            <textarea
              name="description"
              placeholder="Enter item description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProductPopUp;
