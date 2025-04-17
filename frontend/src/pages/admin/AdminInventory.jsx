import React, { useEffect, useState } from "react";
import { Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import AdminAddProductPopUp from "../../components/admin/AdminAddProductPopUp";
import AdminEditProductPopUp from "../../components/admin/AdminEditProductPopUp";
import AdminSearchField from "../../components/admin/AdminSearchField";

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // For search results
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [sortOption, setSortOption] = useState(""); // Sorting option
  const [sortDirection, setSortDirection] = useState("asc"); // Sorting direction (asc or desc)
  const [showAddProductPopUp, setShowAddProductPopUp] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // Track the product being edited

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
          setFilteredProducts(data.data); // Initialize filtered products
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts(products); // Reset to all products if search is empty
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.brand.toLowerCase().includes(lowerCaseQuery) ||
          product.category.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredProducts(filtered);
    }
  };

  // Handle sorting functionality
  const handleSort = (option) => {
    // Toggle sorting direction if the same option is clicked
    if (sortOption === option) {
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortOption(option);
      setSortDirection("asc"); // Default to ascending when a new option is selected
    }

    const sorted = [...filteredProducts].sort((a, b) => {
      if (option === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (option === "price") {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
      } else if (option === "quantity") {
        return sortDirection === "asc"
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      }
      return 0;
    });
    setFilteredProducts(sorted);
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setFilteredProducts((prevProducts) => [...prevProducts, newProduct]); // Update filtered products
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
    setFilteredProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
  };

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();
        if (data.success) {
          alert("Product deleted successfully!");
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== id)
          );
          setFilteredProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== id)
          );
        } else {
          alert("Failed to delete product: " + data.message);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred while deleting the product.");
      }
    }
  };

  return (
    <div className="px-15 py-5">
      <div className="bg-[#BFC8E5] w-[1540px] h-[880px] flex flex-col gap-y-5 pt-4 rounded-xl">
        {/* Sticky Header */}
        <div className="px-6 py-0 flex justify-between items-center sticky top-0 bg-[#BFC8E5] z-10">
          <div className="text-6xl font-bold">Inventory</div>
          <div className="flex items-center gap-x-4">
            <AdminSearchField onSearch={handleSearch} />
            {/* Dropdown for Sorting */}
            <div className="relative">
              <button
                className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() =>
                  document
                    .getElementById("sortDropdown")
                    .classList.toggle("hidden")
                }
              >
                Sort By <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              <div
                id="sortDropdown"
                className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg hidden"
              >
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => handleSort("name")}
                >
                  Name
                  {sortOption === "name" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ))}
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => handleSort("price")}
                >
                  Price
                  {sortOption === "price" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ))}
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => handleSort("quantity")}
                >
                  Quantity
                  {sortOption === "quantity" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ))}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddProductPopUp(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-x-2 cursor-pointer"
          >
            <Plus className="w-5 h-5 hover:text-gray-200" />
            Add Product
          </button>
        </div>
        {/* Scrollable Products */}
        <div className="px-6 py-4 overflow-y-auto h-[calc(100%-80px)]">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-4"
              >
                <div className="flex items-center gap-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg"
                  />
                  <div>
                    <div className="font-bold text-lg">{product.name}</div>
                    <div className="text-gray-500">
                      ₱{product.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-x-4">
                  {/* Fixed width for the Edit button */}
                  <button
                    onClick={() => setEditProduct(product)}
                    className="bg-blue-100 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-200 w-[70px] text-center"
                  >
                    Edit
                  </button>
                  {/* Fixed width for the stock amount */}
                  <div className="font-bold text-gray-700 text-center w-[100px]">
                    {product.quantity} in Stock
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="bg-red-100 text-red-500 px-4 py-2 rounded-lg hover:bg-red-200 flex items-center"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No products available</div>
          )}
        </div>
      </div>
      {/* Add Product Pop-Up */}
      {showAddProductPopUp && (
        <AdminAddProductPopUp
          onClose={() => setShowAddProductPopUp(false)}
          onProductAdded={handleProductAdded}
        />
      )}
      {/* Edit Product Pop-Up */}
      {editProduct && (
        <AdminEditProductPopUp
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
};

export default AdminInventory;
