import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [bestSellingItems, setBestSellingItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const bestSellingResponse = await fetch("http://localhost:5000/api/analytics/best-selling");
        const bestSellingData = await bestSellingResponse.json();
        if (bestSellingData.success) {
          setBestSellingItems(bestSellingData.data);
        }

        const lowStockResponse = await fetch("http://localhost:5000/api/analytics/low-stock");
        const lowStockData = await lowStockResponse.json();
        if (lowStockData.success) {
          setLowStockItems(lowStockData.data);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="px-6 py-8">
      <div className="text-6xl font-bold mb-8">Dashboard Overview</div>

      {/* Best-Selling Items */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Best-Selling Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bestSellingItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg mb-4"
              />
              <div className="font-bold text-lg">{item.name}</div>
              <div className="text-gray-500">Sold: {item.sold}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Low-Stock Items */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Items Low on Stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowStockItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg mb-4"
              />
              <div className="font-bold text-lg">{item.name}</div>
              <div className="text-red-500">Stock: {item.quantity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;