import React from "react";
import { ClipboardList, House, PackageOpen, ShoppingCart } from "lucide-react";
import SidebarButton from "./SidebarButton";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="bg-[#323366] h-screen w-[257px] flex flex-col justify-center items-center gap-y-20">
      <Link to="/dashboard">
        <SidebarButton
          label={"Dashboard"}
          icon={<House color="white" width={76} height={78} />}
        />
      </Link>

      <Link to="/checkout">
        {" "}
        <SidebarButton
          label={"Checkout"}
          icon={<ShoppingCart color="white" width={76} height={78} />}
        />
      </Link>

      <Link to="/inventory">
        <SidebarButton
          label={"Inventory"}
          icon={<PackageOpen color="white" width={76} height={78} />}
        />
      </Link>

      <Link to="/transaction-history">
        <SidebarButton
          label={"Transaction History"}
          icon={<ClipboardList color="white" width={76} height={78} />}
        />
      </Link>
    </div>
  );
};

export default AdminSidebar;
