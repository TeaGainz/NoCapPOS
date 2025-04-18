import React from "react";

const SidebarButton = ({ label, icon, isOpen }) => {
  return (
    <button
      className={`bg-[#6B8CB2]/50 ${
        isOpen ? "w-[160px] h-[145px]" : "w-[60px] h-[45px]"
      } hover:bg-[#6B8CB2]/70 cursor-pointer rounded-lg flex flex-col items-center justify-center gap-y-2 transition-all duration-300`}
    >
      {icon}
      {isOpen && <div className="text-white font-bold text-sm">{label}</div>}
    </button>
  );
};

export default SidebarButton;