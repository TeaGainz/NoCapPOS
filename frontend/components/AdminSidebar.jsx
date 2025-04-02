import React from "react";
import box from "./box.png";
import checkout from "./checkout.png";
import clipboard from "./clipboard.png";
import home from "./home.png";
import "./sidebarStyle.css";

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <div className="group">
        <div className="overlap-group-wrapper">
          <div className="overlap-group">
            <div className="text-wrapper">Dashboard</div>

            <img className="home" alt="Home" src={home} />
          </div>
        </div>

        <div className="overlap-wrapper">
          <div className="overlap-group">
            <img className="checkout" alt="Checkout" src={checkout} />

            <div className="div">Checkout</div>
          </div>
        </div>

        <div className="div-wrapper">
          <div className="overlap-group">
            <div className="div">Inventory</div>

            <img className="box" alt="Box" src={box} />
          </div>
        </div>

        <div className="group-2">
          <div className="overlap-group">
            <div className="transaction-history">
              Transaction
              <br />
              History
            </div>

            <img className="clipboard" alt="Clipboard" src={clipboard} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;