import React, { useEffect, useState } from "react";
import { Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import AdminAddProductPopUp from "../../components/admin/AdminAddProductPopUp";
import AdminEditProductPopUp from "../../components/admin/AdminEditProductPopUp";
import AdminSearchField from "../../components/admin/AdminSearchField";

const AdminInventory = () => {
  const [keyboards, setKeyboards] = useState([]);
  const [keycaps, setKeycaps] = useState([]);
  const [switches, setSwitches] = useState([]);
  const [others, setOthers] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showAddProductPopUp, setShowAddProductPopUp] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Fetch products from the API
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // Fetch keyboards
        const keyboardsResponse = await fetch("http://localhost:5000/api/keyboard");
        const keyboardsData = await keyboardsResponse.json();
        
        // Fetch keycaps
        const keycapsResponse = await fetch("http://localhost:5000/api/keycaps");
        const keycapsData = await keycapsResponse.json();
        
        // Fetch switches
        const switchesResponse = await fetch("http://localhost:5000/api/switches");
        const switchesData = await switchesResponse.json();
        
        // Fetch others
        const othersResponse = await fetch("http://localhost:5000/api/others");
        const othersData = await othersResponse.json();

        // Set individual category states
        setKeyboards(keyboardsData.success ? keyboardsData.data : []);
        setKeycaps(keycapsData.success ? keycapsData.data : []);
        setSwitches(switchesData.success ? switchesData.data : []);
        setOthers(othersData.success ? othersData.data : []);

        // Combine all products for the filtered products state
        const allProducts = [
          ...(keyboardsData.success ? keyboardsData.data.map(item => ({...item, category: 'keyboards'})) : []),
          ...(keycapsData.success ? keycapsData.data.map(item => ({...item, category: 'keycaps'})) : []),
          ...(switchesData.success ? switchesData.data.map(item => ({...item, category: 'switches'})) : []),
          ...(othersData.success ? othersData.data.map(item => ({...item, category: 'others'})) : [])
        ];
        
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      // Combine all products when search is empty
      setFilteredProducts([...keyboards, ...keycaps, ...switches, ...others]);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = [...keyboards, ...keycaps, ...switches, ...others].filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.brand?.toLowerCase().includes(lowerCaseQuery) ||
          (product.category && product.category.toLowerCase().includes(lowerCaseQuery))
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

  // Handle product addition
  const handleProductAdded = (newProduct) => {
    // Determine which category state to update
    switch (newProduct.category?.toLowerCase()) {
      case 'keyboard':
      case 'keyboards':
        setKeyboards(prev => [...prev, newProduct]);
        break;
      case 'keycap':
      case 'keycaps':
        setKeycaps(prev => [...prev, newProduct]);
        break;
      case 'switch':
      case 'switches':
        setSwitches(prev => [...prev, newProduct]);
        break;
      case 'other':
      case 'others':
        setOthers(prev => [...prev, newProduct]);
        break;
      default:
        console.error('Unknown category:', newProduct.category);
    }
    
    // Add to filtered products
    setFilteredProducts(prev => [...prev, newProduct]);
  };

  // Handle product update
  const handleProductUpdated = (updatedProduct) => {
    // Create the update function
    const updateStateArray = (prevState) => 
      prevState.map((item) => 
        item._id === updatedProduct._id ? updatedProduct : item
      );
  
    // Update the specific category state
    switch (updatedProduct.category?.toLowerCase()) {
      case 'keyboard':
      case 'keyboards':
        setKeyboards(prev => updateStateArray(prev));
        break;
      case 'keycap':
      case 'keycaps':
        setKeycaps(prev => updateStateArray(prev));
        break;
      case 'switch':
      case 'switches':
        setSwitches(prev => updateStateArray(prev));
        break;
      case 'other':
      case 'others':
        setOthers(prev => updateStateArray(prev));
        break;
      default:
        console.error('Unknown category:', updatedProduct.category);
    }
  
    // Update filtered products
    setFilteredProducts(prev => updateStateArray(prev));
  };

  // Handle product deletion
  const handleDeleteProduct = async (id, category) => {
    if (!category) {
      console.error('No category provided for deletion');
      return;
    }
  
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Standardize category name for endpoint
        let endpoint;
        
        // Get the correct singular form endpoint
        if (category.toLowerCase().includes('keyboard')) {
          endpoint = 'keyboard';
        } else if (category.toLowerCase().includes('keycap')) {
          endpoint = 'keycaps';
        } else if (category.toLowerCase().includes('switch')) {
          endpoint = 'switches';
        } else if (category.toLowerCase().includes('other')) {
          endpoint = 'others';
        } else {
          throw new Error(`Invalid category: ${category}`);
        }
  
        const response = await fetch(
          `http://localhost:5000/api/${endpoint}/${id}`,
          {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to delete product: HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Update the specific category state using the correctly mapped endpoint
          if (endpoint === 'keyboard') {
            setKeyboards(prev => prev.filter(item => item._id !== id));
          } else if (endpoint === 'keycaps') {
            setKeycaps(prev => prev.filter(item => item._id !== id));
          } else if (endpoint === 'switches') {
            setSwitches(prev => prev.filter(item => item._id !== id));
          } else if (endpoint === 'others') {
            setOthers(prev => prev.filter(item => item._id !== id));
          }
  
          // Update filtered products
          setFilteredProducts(prev => prev.filter(item => item._id !== id));
          alert("Product deleted successfully!");
        } else {
          throw new Error(data.message || 'Failed to delete product');
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(`Error deleting product: ${error.message}`);
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
                    className="bg-blue-100 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-200 w-[70px] text-center cursor-pointer"
                  >
                    Edit
                  </button>
                  {/* Fixed width for the stock amount */}
                  <div className="font-bold text-gray-700 text-center w-[100px]">
                    {product.quantity} in Stock
                  </div>
                  <button
                    onClick={() =>
                      handleDeleteProduct(product._id, product.category)
                    }
                    className="bg-red-100 text-red-500 px-4 py-2 rounded-lg hover:bg-red-200 flex items-center cursor-pointer"
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