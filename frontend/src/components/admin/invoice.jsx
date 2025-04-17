import React from "react";

const Invoice = ({ transaction, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4">Invoice</h2>
        <div className="mb-4">
          <strong>Date & Time:</strong> {transaction.date} {transaction.time}
        </div>
        <div className="mb-4">
          <strong>Invoice No.:</strong> {transaction.invoiceNo}
        </div>
        <div className="mb-4">
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded ${
              transaction.status === "Paid"
                ? "bg-green-100 text-green-500"
                : "bg-red-100 text-red-500"
            }`}
          >
            {transaction.status}
          </span>
        </div>
        <div className="mb-4">
          <strong>Amount:</strong> ₱{transaction.amount.toFixed(2)}
        </div>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Invoice;