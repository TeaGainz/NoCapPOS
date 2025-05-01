import React, { useEffect, useState } from "react";

const AdminTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/transactions");
        const data = await response.json();
        if (data.success) {
          setTransactions(data.data);
        } else {
          console.error("Failed to fetch transactions:", data.message);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="px-2 md:px-8 py-5">
      <div className="bg-[#BFC8E5] w-full max-w-full h-auto min-h-[600px] flex flex-col justify-start gap-y-5 overflow-y-auto pt-4 rounded-xl">
        <div className="px-4 md:px-6 py-0">
          <div className="text-3xl md:text-6xl font-bold">Transaction History</div>
        </div>
        <div className="px-2 md:px-6 w-full">
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md min-w-[600px]">
              <thead>
                <tr className="bg-gray-200 text-xs md:text-base">
                  <th className="px-2 md:px-4 py-2">Date & Time</th>
                  <th className="px-2 md:px-4 py-2">Invoice No.</th>
                  <th className="px-2 md:px-4 py-2">Status</th>
                  <th className="px-2 md:px-4 py-2">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="border-b text-xs md:text-base">
                    <td className="px-2 md:px-4 py-2">
                      {new Date(transaction.date).toLocaleString()}
                    </td>
                    <td className="px-2 md:px-4 py-2">{transaction.invoiceNo}</td>
                    <td className="px-2 md:px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          transaction.status === "Paid"
                            ? "bg-green-100 text-green-500"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-2">₱{transaction.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionHistory;