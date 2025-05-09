import React from "react";
import { Search } from "lucide-react";

const AdminSearchField = ({ onSearch }) => {
  return (
    <div className="flex items-center border border-gray-300 rounded-md px-4 w-[425px] h-[60px] bg-white">
      <input
        type="text"
        placeholder="Search..."
        className="ml-3 flex-1 outline-none text-lg text-gray-700 bg-transparent"
        onChange={(e) => onSearch(e.target.value)} // Call onSearch when input changes
      />
      <button
        type="button"
        className="flex items-center justify-center hover:bg-gray-200/70 cursor-pointer w-[50px] h-[50px] rounded-full"
      >
        <Search className="w-6 h-6 text-gray-500" />
      </button>
    </div>
  );
};

export default AdminSearchField;