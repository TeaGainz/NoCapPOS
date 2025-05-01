import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

const AdminDashboard = () => {
  const [keyboards, setKeyboards] = useState([]);
  const [keycaps, setKeycaps] = useState([]);
  const [switches, setSwitches] = useState([]);
  const [others, setOthers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch all products and transactions
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [kb, kc, sw, ot, tx] = await Promise.all([
          fetch("http://localhost:5000/api/keyboard").then(r => r.json()),
          fetch("http://localhost:5000/api/keycaps").then(r => r.json()),
          fetch("http://localhost:5000/api/switches").then(r => r.json()),
          fetch("http://localhost:5000/api/others").then(r => r.json()),
          fetch("http://localhost:5000/api/transactions").then(r => r.json()),
        ]);
        setKeyboards(kb.data || []);
        setKeycaps(kc.data || []);
        setSwitches(sw.data || []);
        setOthers(ot.data || []);
        setTransactions(tx.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchAll();
  }, []);

  // Best-selling by category
  const getBestSelling = (arr, n = 3) =>
    [...arr].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, n);

  // Monthly revenue (bar chart)
  const monthlyRevenue = React.useMemo(() => {
    const revenueMap = {};
    transactions.forEach(tx => {
      const date = tx.createdAt ? format(parseISO(tx.createdAt), "yyyy-MM") : "Unknown";
      revenueMap[date] = (revenueMap[date] || 0) + (parseFloat(tx.totalAmount) || 0);
    });
    return Object.entries(revenueMap)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  // Pie chart: sold by category
  const pieData = [
    { name: "Keyboards", value: keyboards.reduce((sum, k) => sum + (k.sold || 0), 0) },
    { name: "Keycaps", value: keycaps.reduce((sum, k) => sum + (k.sold || 0), 0) },
    { name: "Switches", value: switches.reduce((sum, k) => sum + (k.sold || 0), 0) },
    { name: "Others", value: others.reduce((sum, k) => sum + (k.sold || 0), 0) },
  ];

  // Recent activity: last 10 events (add/edit/delete/sale)
  useEffect(() => {
    // Gather product events
    const allProducts = [
      ...keyboards.map(p => ({ ...p, category: "Keyboard" })),
      ...keycaps.map(p => ({ ...p, category: "Keycaps" })),
      ...switches.map(p => ({ ...p, category: "Switches" })),
      ...others.map(p => ({ ...p, category: "Others" })),
    ];
    const productEvents = allProducts
      .map(p => ({
        type: "Product",
        action: "Added/Edited",
        name: p.name,
        category: p.category,
        date: p.updatedAt || p.createdAt,
      }));

    // Gather sales events
    const salesEvents = transactions.flatMap(tx =>
      (tx.items || []).map(item => ({
        type: "Sale",
        action: "Sold",
        name: item.name,
        category: item.category,
        date: tx.createdAt,
        quantity: item.quantity,
      }))
    );

    // Combine and sort
    const allEvents = [...productEvents, ...salesEvents]
      .filter(e => e.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    setRecentActivity(allEvents);
  }, [keyboards, keycaps, switches, others, transactions]);

  // Low stock items (threshold: 5)
  const lowStockItems = [
    ...keyboards, ...keycaps, ...switches, ...others
  ].filter(item => item.quantity !== undefined && item.quantity <= 5)
   .sort((a, b) => a.quantity - b.quantity)
   .slice(0, 6);

  return (
    <div className="px-2 md:px-6 lg:px-12 py-4 md:py-8">
      <div className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">Dashboard Overview</div>

      {/* Best-Selling by Category */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Best-Selling Keyboards</h2>
          {getBestSelling(keyboards).map(item => (
            <div key={item._id} className="bg-white p-3 rounded-lg shadow mb-2 flex items-center">
              <img src={item.image} alt={item.name} className="w-10 h-10 rounded mr-3" />
              <div>
                <div className="font-bold">{item.name}</div>
                <div className="text-gray-500 text-sm">Sold: {item.sold}</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Best-Selling Keycaps</h2>
          {getBestSelling(keycaps).map(item => (
            <div key={item._id} className="bg-white p-3 rounded-lg shadow mb-2 flex items-center">
              <img src={item.image} alt={item.name} className="w-10 h-10 rounded mr-3" />
              <div>
                <div className="font-bold">{item.name}</div>
                <div className="text-gray-500 text-sm">Sold: {item.sold}</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Best-Selling Switches</h2>
          {getBestSelling(switches).map(item => (
            <div key={item._id} className="bg-white p-3 rounded-lg shadow mb-2 flex items-center">
              <img src={item.image} alt={item.name} className="w-10 h-10 rounded mr-3" />
              <div>
                <div className="font-bold">{item.name}</div>
                <div className="text-gray-500 text-sm">Sold: {item.sold}</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Best-Selling Others</h2>
          {getBestSelling(others).map(item => (
            <div key={item._id} className="bg-white p-3 rounded-lg shadow mb-2 flex items-center">
              <img src={item.image} alt={item.name} className="w-10 h-10 rounded mr-3" />
              <div>
                <div className="font-bold">{item.name}</div>
                <div className="text-gray-500 text-sm">Sold: {item.sold}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Revenue Bar Chart & Pie Chart */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow min-w-0">
          <h2 className="text-lg md:text-xl font-bold mb-4">Monthly Revenue</h2>
          <div className="w-full h-[220px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow min-w-0">
          <h2 className="text-lg md:text-xl font-bold mb-4">Sales by Category</h2>
          <div className="w-full h-[220px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="bg-white p-3 md:p-4 rounded-lg shadow overflow-x-auto">
          <ul>
            {recentActivity.length === 0 && <li className="text-gray-500">No recent activity.</li>}
            {recentActivity.map((event, idx) => (
              <li key={idx} className="mb-2 flex flex-wrap items-center text-xs md:text-base">
                <span className="font-bold mr-2">{event.type}:</span>
                <span className="mr-2">{event.name}</span>
                <span className="text-gray-500 mr-2">({event.category})</span>
                <span className="text-blue-500 mr-2">{event.action}</span>
                {event.quantity && <span className="text-green-600 mr-2">x{event.quantity}</span>}
                <span className="text-gray-400 text-xs">{event.date ? format(new Date(event.date), "PPpp") : ""}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Low-Stock Items */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4">Items Low on Stock</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowStockItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg mb-4 object-cover"
              />
              <div className="font-bold text-base md:text-lg text-center">{item.name}</div>
              <div className="text-red-500">Stock: {item.quantity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;