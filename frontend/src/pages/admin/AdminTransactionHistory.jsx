import React from "react";

const AdminTransactionHistory = () => {
  const transactions = [
    {
      date: "Dec. 2, 2024",
      time: "12:01",
      invoiceNo: "012345678910",
      status: "Paid",
      amount: 1173.6,
    },
    {
      date: "Dec. 2, 2024",
      time: "12:01",
      invoiceNo: "012345678911",
      status: "Expired",
      amount: 1173.6,
    },
  ];

  return (
    <div className="px-15 py-5">
      <div className="bg-[#BFC8E5] w-[1540px] h-[880px] flex flex-col justify-start gap-y-5 overflow-y-auto pt-4 rounded-xl">
        <div className="px-6 py-0">
          <div className="text-6xl font-bold">Transaction History</div>
        </div>
        <div className="px-6">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Date & Time</th>
                <th className="px-4 py-2">Invoice No.</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    {transaction.date} {transaction.time}
                  </td>
                  <td className="px-4 py-2">{transaction.invoiceNo}</td>
                  <td className="px-4 py-2">
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
                  <td className="px-4 py-2">₱{transaction.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionHistory;