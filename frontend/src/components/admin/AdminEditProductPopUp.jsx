import React, { useState } from "react";

const AdminEditProductPopUp = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    category: product.category || "",
    brand: product.brand || "",
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    quantity: product.quantity || "",
    image: product.image || "",
    imageLink: "", // Optional field for entering a new image link
    // Additional fields for specific categories will be added dynamically
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalImage = formData.image || formData.imageLink;

    if (!finalImage) {
      alert("Please upload an image or provide an image link.");
      return;
    }

    try {
      // Determine the API endpoint based on the selected category
      const categoryEndpointMap = {
        Keyboard: "keyboards",
        Switches: "switches",
        Keycaps: "keycaps",
        Others: "others",
      };

      const endpoint = categoryEndpointMap[formData.category];
      if (!endpoint) {
        alert("Invalid category selected.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/${endpoint}/${product._id}`,
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

  // Render fields dynamically based on the selected category
  const renderCategoryFields = () => {
    switch (formData.category) {
      case "Keyboard":
        return (
          <>
            <div>
              <label className="block font-bold mb-1">Switch Options:</label>
              <input
                type="text"
                name="switchOptions"
                placeholder="Enter switch options"
                value={formData.switchOptions || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Layout Size:</label>
              <input
                type="text"
                name="layoutSize"
                placeholder="Enter layout size"
                value={formData.layoutSize || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            {/* Add other keyboard-specific fields here */}
          </>
        );
      case "Switches":
        return (
          <>
            <div>
              <label className="block font-bold mb-1">Switch Type:</label>
              <input
                type="text"
                name="switchType"
                placeholder="Enter switch type"
                value={formData.switchType || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Actuation Force:</label>
              <input
                type="text"
                name="actuationForce"
                placeholder="Enter actuation force"
                value={formData.actuationForce || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            {/* Add other switches-specific fields here */}
          </>
        );
      case "Keycaps":
        return (
          <>
            <div>
              <label className="block font-bold mb-1">Profile:</label>
              <input
                type="text"
                name="profile"
                placeholder="Enter keycap profile"
                value={formData.profile || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Material:</label>
              <input
                type="text"
                name="material"
                placeholder="Enter keycap material"
                value={formData.material || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            {/* Add other keycaps-specific fields here */}
          </>
        );
      case "Others":
        return (
          <>
            <div>
              <label className="block font-bold mb-1">Description:</label>
              <textarea
                name="description"
                placeholder="Enter description"
                value={formData.description || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                rows="4"
              ></textarea>
            </div>
            {/* Add other "Others"-specific fields here */}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          {/* Category Dropdown */}
          <div>
            <label className="block font-bold mb-1">Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Keyboard">Keyboard</option>
              <option value="Keycaps">Keycaps</option>
              <option value="Switches">Switches</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Dynamically Rendered Fields */}
          {renderCategoryFields()}

          {/* Common Fields */}
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