import React, { useEffect, useState } from "react";
import { Search, ShoppingCart, Trash2, X } from "lucide-react";
import AdminSearchField from "../../components/admin/AdminSearchField";

const AdminCheckout = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [taxRate, setTaxRate] = useState(""); //tax value
  const [rawTaxRate, setRawTaxRate] = useState(""); // Temporary state for raw input

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

        // Combine all products
        const allProducts = [
          ...(keyboardsData.success ? keyboardsData.data.map(item => ({...item, category: 'keyboard'})) : []),
          ...(keycapsData.success ? keycapsData.data.map(item => ({...item, category: 'keycaps'})) : []),
          ...(switchesData.success ? switchesData.data.map(item => ({...item, category: 'switches'})) : []),
          ...(othersData.success ? othersData.data.map(item => ({...item, category: 'others'})) : [])
        ];

        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAllProducts();
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
    // Count how many of this product are already in the cart
    const cartQuantity = cart.filter((item) => item._id === product._id).length;

    // Check if adding another would exceed the stock
    if (cartQuantity >= product.quantity) {
      alert(
        `Cannot add more of ${product.name}. Only ${product.quantity} in stock.`
      );
      return;
    }

    // Add product to cart
    setCart((prevCart) => [...prevCart, product]);
  };

  // Remove product from cart
  const handleRemoveFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // Group cart items by productId and sum quantity
  const getCartSummary = () => {
    const summary = {};
    cart.forEach(item => {
      if (!summary[item._id]) {
        summary[item._id] = { ...item, quantity: 1 };
      } else {
        summary[item._id].quantity += 1;
      }
    });
    return Object.values(summary);
  };

  // Calculate total price
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  // Calculate total with tax
  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const tax = subtotal * taxRate; // Use the dynamic tax rate
    return (subtotal + tax).toFixed(2);
  };

  // Handle checkout
  const handleCheckout = async () => {
    try {
      const items = getCartSummary();

      const totalAmount = calculateTotal();

      // Create a transaction
      const transactionResponse = await fetch(
        "http://localhost:5000/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items, totalAmount }),
        }
      );

      const transactionData = await transactionResponse.json();

      if (!transactionData.success) {
        alert("Failed to record transaction.");
        return;
      }

      // Update stock and sold for each product in the cart
      await Promise.all(items.map(async (item) => {
        let endpoint = "";
        if (item.category === "keyboard") endpoint = "keyboard";
        else if (item.category === "keycaps") endpoint = "keycaps";
        else if (item.category === "switches") endpoint = "switches";
        else if (item.category === "others") endpoint = "others";
        else return;

        // Decrement stock
        await fetch(`http://localhost:5000/api/${endpoint}/${item._id}/decrement`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: item.quantity }),
        });

        // Increment sold
        await fetch(`http://localhost:5000/api/${endpoint}/${item._id}/sales`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sold: item.quantity }),
        });
      }));

      alert("Checkout successful!");
      setCart([]);

      // Fetch updated product list to reflect stock changes
      const fetchAllProducts = async () => {
        try {
          const keyboardsResponse = await fetch("http://localhost:5000/api/keyboard");
          const keyboardsData = await keyboardsResponse.json();
          const keycapsResponse = await fetch("http://localhost:5000/api/keycaps");
          const keycapsData = await keycapsResponse.json();
          const switchesResponse = await fetch("http://localhost:5000/api/switches");
          const switchesData = await switchesResponse.json();
          const othersResponse = await fetch("http://localhost:5000/api/others");
          const othersData = await othersResponse.json();

          const allProducts = [
            ...(keyboardsData.success ? keyboardsData.data.map(item => ({...item, category: 'keyboard'})) : []),
            ...(keycapsData.success ? keycapsData.data.map(item => ({...item, category: 'keycaps'})) : []),
            ...(switchesData.success ? switchesData.data.map(item => ({...item, category: 'switches'})) : []),
            ...(othersData.success ? othersData.data.map(item => ({...item, category: 'others'})) : [])
          ];

          setProducts(allProducts);
          setFilteredProducts(allProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      await fetchAllProducts();
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred during checkout.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Product List */}
      <div className="bg-[#BFC8E5] w-full lg:w-[710px] flex flex-col justify-start items-center gap-y-5 overflow-y-auto pt-4">
        <div className="w-full px-4 md:px-6">
          <div className="text-2xl md:text-3xl lg:text-5xl font-bold">Checkout</div>
          <div className="h-4"></div>
          <AdminSearchField onSearch={handleSearch} />
        </div>
        <div className="w-full px-4 md:px-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow-md mb-4"
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
                  <div
                    className={`text-sm font-bold ${
                      product.quantity > 0 ? "text-black" : "text-red-500"
                    }`}
                  >
                    {product.quantity > 0
                      ? `In Stock: ${product.quantity}`
                      : "Out of Stock"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.quantity <= 0}
                className={`${
                  product.quantity > 0
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white px-4 py-2 rounded-lg flex items-center gap-x-2 cursor-pointer w-full sm:w-auto`}
              >
                <ShoppingCart size={16} />
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="bg-white w-full lg:w-[950px] h-[60vh] lg:h-screen shadow-lg flex flex-col justify-between">
        <div className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Cart</h2>
          <div className="overflow-y-auto max-h-[200px] md:max-h-[400px]">
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
                    <div className="font-bold text-base md:text-lg">{item.name}</div>
                    <div className="text-gray-500 text-sm md:text-base">
                      ₱{item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(index)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 md:p-6 border-t">
          <div className="w-full mb-4">
            <label className="block text-base md:text-lg font-bold mb-2">Tax Rate (%)</label>
            <input
              type="number"
              value={rawTaxRate}
              onChange={(e) => {
                const value = e.target.value;
                setRawTaxRate(value);
                const parsedValue = parseFloat(value);
                if (!isNaN(parsedValue)) {
                  setTaxRate(parseFloat((parsedValue / 100).toFixed(2)));
                } else {
                  setTaxRate(0);
                }
              }}
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-base md:text-lg font-bold">Subtotal</span>
            <span className="text-base md:text-lg font-bold">₱{calculateSubtotal()}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-base md:text-lg font-bold">
              Tax ({(taxRate * 100).toFixed(0)}%)
            </span>
            <span className="text-base md:text-lg font-bold">
              ₱{(calculateSubtotal() * taxRate).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg md:text-xl font-bold">Total</span>
            <span className="text-lg md:text-xl font-bold">₱{calculateTotal()}</span>
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
