import React from "react";


const SidebarButton = ({label, icon}) => {
  return (
    <button className="bg-[#6B8CB2]/50 h-[145px] w-[160px] hover:bg-[#6B8CB2]/70 cursor-pointer rounded-xl flex flex-col justify-center items-center">
      {icon}
      <div className="text-white font-bold ">{label}</div>
    </button>
  );
};

export default SidebarButton;
