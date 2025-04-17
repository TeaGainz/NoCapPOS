import React, { useEffect, useState } from "react";
import { Search, ShoppingCart, Trash2, X } from "lucide-react";
import AdminSearchField from "../../components/admin/AdminSearchField";

const AdminCheckout = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
          setFilteredProducts(data.data);
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
    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.brand.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredProducts(filtered);
    }
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // Remove product from cart
  const handleRemoveFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  // Handle checkout
  const handleCheckout = async () => {
    try {
      for (const item of cart) {
        const updatedQuantity = item.quantity - 1;
        if (updatedQuantity < 0) {
          alert(`Insufficient stock for ${item.name}`);
          return;
        }

        await fetch(`http://localhost:5000/api/products/${item._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...item, quantity: updatedQuantity }),
        });
      }

      alert("Checkout successful!");
      setCart([]);
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
        setFilteredProducts(data.data);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="bg-[#BFC8E5] w-[710px] flex flex-col justify-start items-center gap-y-5 overflow-y-auto pt-4">
        <div className="w-full px-6">
          <div className="text-5xl font-bold">Checkout</div>
          <div className="h-4"></div>
          <AdminSearchField onSearch={handleSearch} />
        </div>

        {/* Product List */}
        <div className="w-full px-6">
          {filteredProducts.map((product) => (
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
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-x-2"
              >
                <ShoppingCart size={16} />
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="bg-white w-[950px] h-screen shadow-lg flex flex-col justify-between">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Cart</h2>
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md mb-4"
            >
              <div className="flex items-center gap-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <div className="font-bold text-lg">{item.name}</div>
                  <div className="text-gray-500">₱{item.price.toFixed(2)}</div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFromCart(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="p-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Subtotal</span>
            <span className="text-lg font-bold">₱{calculateTotal()}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Tax</span>
            <span className="text-lg font-bold">₱0.00</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold">Total</span>
            <span className="text-xl font-bold">₱{calculateTotal()}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-blue-500 text-white w-full py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-x-2"
          >
            <ShoppingCart size={20} />
            Charge
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCheckout;
