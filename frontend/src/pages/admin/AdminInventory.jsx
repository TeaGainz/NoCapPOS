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
  const [categoryFilter, setCategoryFilter] = useState('all');

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
          ...(keyboardsData.success ? keyboardsData.data.map(item => ({...item, category: 'keyboard'})) : []),
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
    if (sortOption === option) {
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortOption(option);
      setSortDirection("asc");
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

  // Handle category filtering
  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    if (category === 'all') {
      setFilteredProducts([...keyboards, ...keycaps, ...switches, ...others]);
    } else {
      // Standardize category names for comparison
      const categoryMap = {
        'keyboards': ['keyboard', 'keyboards'],
        'keycaps': ['keycap', 'keycaps'],
        'switches': ['switch', 'switches'],
        'others': ['other', 'others']
      };

      const allowedCategories = categoryMap[category.toLowerCase()] || [];
      
      const filtered = [...keyboards, ...keycaps, ...switches, ...others].filter(
        (product) => {
          const productCategory = product.category?.toLowerCase();
          return allowedCategories.includes(productCategory);
        }
      );
      setFilteredProducts(filtered);
    }
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
    <div className="px-2 md:px-8 py-5">
      <div className="bg-[#BFC8E5] w-full max-w-full h-auto min-h-[600px] flex flex-col gap-y-5 pt-4 rounded-xl">
        {/* Sticky Header */}
        <div className="px-4 md:px-6 py-0 flex flex-col md:flex-row justify-between items-start md:items-center sticky top-0 bg-[#BFC8E5] z-10 gap-y-2">
          <div className="text-3xl md:text-6xl font-bold">Inventory</div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <AdminSearchField onSearch={handleSearch} />
            {/* Category Filter Dropdown */}
            <div className="relative">
              <button
                className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() =>
                  document
                    .getElementById("categoryDropdown")
                    .classList.toggle("hidden")
                }
              >
                Filter By Category <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              <div
                id="categoryDropdown"
                className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg hidden"
              >
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleCategoryFilter('all')}
                >
                  All Products
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleCategoryFilter('keyboards')}
                >
                  Keyboards
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleCategoryFilter('keycaps')}
                >
                  Keycaps
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleCategoryFilter('switches')}
                >
                  Switches
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleCategoryFilter('others')}
                >
                  Others
                </button>
              </div>
            </div>
            {/* Sort Dropdown */}
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
            <button
              onClick={() => setShowAddProductPopUp(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-x-2 cursor-pointer"
            >
              <Plus className="w-5 h-5 hover:text-gray-200" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </div>
        {/* Scrollable Products */}
        <div className="px-2 md:px-6 py-4 overflow-y-auto h-[calc(100%-80px)]">
          <div className="flex flex-col gap-y-4 w-full min-w-[320px]">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-x-4 w-full sm:w-auto mb-2 sm:mb-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg"
                    />
                    <div>
                      <div className="font-bold text-base md:text-lg">{product.name}</div>
                      <div className="text-gray-500 text-sm md:text-base">
                        ₱{product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-2 w-full sm:w-auto">
                    <button
                      onClick={() => setEditProduct(product)}
                      className="bg-blue-100 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-200 w-[70px] text-center cursor-pointer"
                    >
                      Edit
                    </button>
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