import React, { useState } from "react";
import { ClipboardList, House, PackageOpen, ShoppingCart, Menu } from "lucide-react";
import SidebarButton from "./SidebarButton";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`bg-[#323366] ${
        isOpen ? "w-[257px]" : "w-[80px]"
      } h-screen flex flex-col justify-between transition-all duration-300`}
    >
      {/* Burger Icon */}
      <div className="flex justify-end p-4">
        <button
          className="text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Buttons */}
      <div className="flex flex-col items-center gap-y-6 flex-1 justify-center">
        <Link to="/">
          <SidebarButton
            label={isOpen ? "Dashboard" : ""}
            icon={<House color="white" width={40} height={40} />}
            isOpen={isOpen}
          />
        </Link>
        <Link to="/checkout">
          <SidebarButton
            label={isOpen ? "Checkout" : ""}
            icon={<ShoppingCart color="white" width={40} height={40} />}
            isOpen={isOpen}
          />
        </Link>
        <Link to="/inventory">
          <SidebarButton
            label={isOpen ? "Inventory" : ""}
            icon={<PackageOpen color="white" width={40} height={40} />}
            isOpen={isOpen}
          />
        </Link>
        <Link to="/transaction-history">
          <SidebarButton
            label={isOpen ? "Transaction History" : ""}
            icon={<ClipboardList color="white" width={40} height={40} />}
            isOpen={isOpen}
          />
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;