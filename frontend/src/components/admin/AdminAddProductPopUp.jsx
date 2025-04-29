import React, { useState } from "react";

const AdminAddProductPopUp = ({ onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    category: "",
    brand: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalImage = formData.image || formData.imageLink;

    if (!finalImage) {
      alert("Please upload an image or provide an image link.");
      return;
    }

    try {
      // Determine the API endpoint based on the selected category
      const categoryEndpointMap = {
        Keyboard: "keyboard",
        Switches: "switches",
        Keycaps: "keycaps",
        Others: "others",
      };

      const endpoint = categoryEndpointMap[formData.category];
      if (!endpoint) {
        alert("Invalid category selected.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, image: finalImage }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Product added successfully!");
        onProductAdded(data.data);
        onClose();
      } else {
        alert("Failed to add product: " + data.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    }
  };

  // Render fields dynamically based on the selected category
  const renderCategoryFields = () => {
    switch (formData.category) {
      case "Keyboard":
        return (
          <>
            <div className="block font-extrabold mb-1">
              Category specific optional additonal details
            </div>
            <div></div>
            <div>
              <label className="block font-bold mb-1">Switch Options:</label>
              <select
                name="switchOptions"
                value={formData.switchOptions || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Case Material --</option>
                <option value="Linear">Linear</option>
                <option value="Tactile">Tactile</option>
                <option value="Clicky">Clicky</option>
                <option value="Silent">Silent</option>
                <option value="Magnetic">Magnetic</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Layout Size:</label>
              <select
                name="layoutSize"
                value={formData.layoutSize || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Layout Size --</option>
                <option value="100%">100%</option>
                <option value="98%">98%</option>
                <option value="97%">97%</option>
                <option value="96%">96%</option>
                <option value="95%">95%</option>
                <option value="90%">90%</option>
                <option value="87%">87%</option>
                <option value="85%">85%</option>
                <option value="84%">84%</option>
                <option value="80%">80%</option>
                <option value="78%">78%</option>
                <option value="75%">75%</option>
                <option value="70%">70%</option>
                <option value="68%">68%</option>
                <option value="66%">66%</option>
                <option value="65%">65%</option>
                <option value="64%">64%</option>
                <option value="60%">60%</option>
                <option value="50%">50%</option>
                <option value="40%">40%</option>
                <option value="Numpad">Numpad</option>
                <option value="Macropad">Macropad</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Add other keyboard-specific fields here */}
            <div>
              <label className="block font-bold mb-1">Keyboard Profile:</label>
              <select
                name="profile"
                value={formData.profile || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Profile --</option>
                <option value="Normal Profile">Normal Profile</option>
                <option value="Low Profile">Low Profile</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Release Year:</label>
              <input
                type="text" // Changed from "text" to "date"
                name="releaseYear"
                placeholder="YYYY"
                value={formData.releaseYear || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Layout Standard:</label>
              <select
                name="layoutStandard"
                value={formData.layoutStandard || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Layout Standard --</option>
                <option value="ANSI">ANSI</option>
                <option value="ISO">ISO</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Layout Ergonomics:</label>
              <select
                name="layoutErgonomics"
                value={formData.layoutErgonomics || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Layout Ergonomics --</option>
                <option value="Normal">Normal</option>
                <option value="Alice">Alice</option>
                <option value="Split">Split</option>
                <option value="Split Spacebar">Split Spacebar</option>
                <option value="Split Backspace">Split Backspace</option>
                <option value="Ortholinear">Ortholinear</option>
                <option value="Southpaw">Southpaw</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Connectivity:</label>
              <select
                name="connectivity"
                value={formData.connectivity || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Connectivity Options--</option>
                <option value="Wired only">Wired only</option>
                <option value="Wireless">Wireless</option>
                <option value="Hybrid">Hybrid</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Max Polling Rate:</label>
              <select
                name="pollingRate"
                value={formData.pollingRate || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Max Polling Rate --</option>
                <option value="32000 Hz">32000 Hz</option>
                <option value="8000 Hz">8000 Hz</option>
                <option value="4000 Hz">4000 Hz</option>
                <option value="2000 Hz">2000 Hz</option>
                <option value="1000 Hz">1000 Hz</option>
                <option value="500 Hz">500 Hz</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="batteryCapacity" className="block font-bold mb-1">
                Battery Capacity:{" "}
                <span className="text-blue-600">
                  {formData.batteryCapacity ?? 0} mAh
                </span>
              </label>
              <input
                type="range"
                id="batteryCapacity"
                name="batteryCapacity"
                min="0"
                max="20000"
                step="1"
                value={formData.batteryCapacity ?? 0}
                onChange={(e) => {
                  // parse to number so you don't end up with a string
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    batteryCapacity: val,
                  }));
                }}
                className="w-full h-2 bg-gray-200 rounded-lg accent-blue-500 cursor-pointer"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Mount Type:</label>
              <select
                name="mountType"
                value={formData.mountType || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Mount Type --</option>
                <option value="Top Mount">Top Mount</option>
                <option value="Gasket Mount">Gasket Mount</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">Case Color:</label>
              <select
                name="caseColors"
                value={formData.caseColors || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Case Color --</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Grey">Grey</option>
                <option value="Blue">Blue</option>
                <option value="Pink">Pink</option>
                <option value="Beige">Beige</option>
                <option value="Purple">Purple</option>
                <option value="Red">Red</option>
                <option value="Brown">Brown</option>
                <option value="Clear">Clear</option>
                <option value="Orange">Orange</option>
                <option value="Yellow">Yellow</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Case Material:</label>
              <select
                name="caseMaterial"
                value={formData.caseMaterial || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Case Material --</option>
                <option value="Plastic">Plastic</option>
                <option value="Polycarbonate">Polycarbonate</option>
                <option value="Aluminum">Aluminum</option>
                <option value="FR4">FR4</option>
                <option value="Steel">Steel</option>
                <option value="POM">POM</option>
                <option value="CarbonFiber">CarbonFiber</option>
                <option value="Brass">Brass</option>
                <option value="Acrylic">Acrylic</option>
                <option value="Silicone">Silicone</option>
                <option value="Copper">Copper</option>
                <option value="Titanium">Titanium</option>
                <option value="Ceramic">Ceramic</option>
                <option value="Marble">Marble</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Keycap Material:</label>
              <select
                name="keycapMaterial"
                value={formData.keycapMaterial || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Keycap Material --</option>
                <option value="PBT">PBT</option>
                <option value="ABS">ABS</option>
                <option value="Ceramic">Ceramic</option>
                <option value="Aluminum">Aluminum</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Case Dimensions:</label>
              <input
                type="text"
                name="dimensions"
                placeholder="Enter dimensions"
                value={formData.dimensions || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="weight" className="block font-bold mb-1">
                Weight:{" "}
                <span className="text-blue-600">{formData.weight ?? 0} g</span>
              </label>
              <input
                type="range"
                id="weight"
                name="weight"
                min="0"
                max="6000"
                step="1"
                value={formData.weight ?? 0}
                onChange={(e) => {
                  // parse to number so you don't end up with a string
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    weight: val,
                  }));
                }}
                className="w-full h-2 bg-gray-200 rounded-lg accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Knob Support:</label>
              <select
                name="knobSupport"
                value={formData.knobSupport || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Knob Support --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">Display Support:</label>
              <select
                name="displaySupport"
                value={formData.displaySupport || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Display Support --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">Hot Swappability:</label>
              <select
                name="isHotSwappable"
                value={formData.isHotSwappable || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Hot Swappability --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">Backlight:</label>
              <select
                name="backlight"
                value={formData.backlight || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Backlight --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">Multi Media Keys:</label>
              <select
                name="multiMediaKeys"
                value={formData.multiMediaKeys || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Multi Media Keys --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">Win/Mac Support:</label>
              <select
                name="winMacSupport"
                value={formData.winMacSupport || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Win/Mac Support --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">USB C Support:</label>
              <select
                name="usb_C"
                value={formData.usb_C || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select USB C Support --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">
                Hall Effect Support:
              </label>
              <select
                name="hallEffectSupport"
                value={formData.hallEffectSupport || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Hall Effect Support --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">QMK Support:</label>
              <select
                name="qmkSupport"
                value={formData.qmkSupport || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select QMK Support --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">VIA Support:</label>
              <select
                name="viaSupport"
                value={formData.viaSupport || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select VIA Support --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">
                N-Key Rollover Support:
              </label>
              <select
                name="nkeyRollover"
                value={formData.nkeyRollover || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select N-Key Rollover Support --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">
                Screw-in Stabilizers Support:
              </label>
              <select
                name="screwInStabilizers"
                value={formData.screwInStabilizers || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select N-Key Rollover Support --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">
                Sound Dampening Support:
              </label>
              <select
                name="soundDampening"
                value={formData.soundDampening || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Sound Dampening Support --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
          </>
        );
      case "Switches":
        return (
          <>
            <div className="block font-extrabold mb-1">
              Category specific optional additonal details
            </div>
            <div></div>
            <div>
              <label className="block font-bold mb-1">Actuation Force:</label>
              <input
                type="text"
                name="actuationForce"
                placeholder="Enter actuation force"
                value={formData.actuationForce || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            {/* Add other switches-specific fields here */}
            <div>
              <label className="block font-bold mb-1">Release Year:</label>
              <input
                type="text"
                name="releaseYear"
                placeholder="YYYY"
                value={formData.releaseYear || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Switch Type:</label>
              <select
                name="switchType"
                value={formData.switchType || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Switch Type --</option>
                <option value="Linear">Linear</option>
                <option value="Tactile">Tactile</option>
                <option value="Clicky">Clicky</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Stem Material:</label>
              <select
                name="stemMaterial"
                value={formData.stemMaterial || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Stem Material --</option>
                <option value="POM">POM</option>
                <option value="LY">LY</option>
                <option value="UPE">UPE</option>
                <option value="Nylon">Nylon</option>
                <option value="POK">POK</option>
                <option value="PC">PC</option>
                <option value="PBT">PBT</option>
                <option value="UHMWPE">UHMWPE</option>
                <option value="PME">PME</option>
                <option value="ABS">ABS</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">
                Top Housing Material:
              </label>
              <select
                name="topHousingMaterial"
                value={formData.topHousingMaterial || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Top Housing Material --</option>
                <option value="POM">POM</option>
                <option value="LY">LY</option>
                <option value="UPE">UPE</option>
                <option value="Nylon">Nylon</option>
                <option value="POK">POK</option>
                <option value="PC">PC</option>
                <option value="PBT">PBT</option>
                <option value="UHMWPE">UHMWPE</option>
                <option value="PME">PME</option>
                <option value="ABS">ABS</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">
                Bottom Housing Material:
              </label>
              <select
                name="bottomHousingMaterial"
                value={formData.bottomHousingMaterial || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Bottom Housing Material --</option>
                <option value="POM">POM</option>
                <option value="LY">LY</option>
                <option value="UPE">UPE</option>
                <option value="Nylon">Nylon</option>
                <option value="POK">POK</option>
                <option value="PC">PC</option>
                <option value="PBT">PBT</option>
                <option value="UHMWPE">UHMWPE</option>
                <option value="PME">PME</option>
                <option value="ABS">ABS</option>
                <option value="PTFE">PTFE</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Spring Type:</label>
              <select
                name="springs"
                value={formData.springs || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Spring Type --</option>
                <option value="Standard">Standard</option>
                <option value="Double-Stage">Double-Stage</option>
                <option value="Progressive">Progressive</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Number of Pins:</label>
              <select
                name="pins"
                value={formData.pins || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Number of Pins --</option>
                <option value="5-Pin">5-Pin</option>
                <option value="3-Pin">3-Pin</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
          </>
        );
      case "Keycaps":
        return (
          <>
            <div className="block font-extrabold mb-1">
              Category specific optional additonal details
            </div>
            <div></div>
            <div>
              <label className="block font-bold mb-1">Profile:</label>
              <input
                type="text"
                name="profile"
                placeholder="Enter keycap profile"
                value={formData.profile || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Material:</label>
              <input
                type="text"
                name="material"
                placeholder="Enter keycap material"
                value={formData.material || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            {/* Add other keycaps-specific fields here */}
          </>
        );
      case "Others":
        return <></>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Add Product</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form
            id="product-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-4"
          >
            {/* Product Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">Category:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required="false"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="Keyboard">Keyboard</option>
                  <option value="Keycaps">Keycaps</option>
                  <option value="Switches">Switches</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* Dynamically Rendered Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderCategoryFields()}
            </div>
            <div className="block font-extrabold mb-1">Required Fields</div>
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">Brand:</label>
                <input
                  type="text"
                  name="brand"
                  placeholder="Enter brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required="false"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Name:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required="false"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Description:</label>
                <textarea
                  name="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required="false"
                  rows="3"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Price:</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required="false"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required="false"
                  min="0"
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex justify-center items-center relative overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const MAX_IMAGE_SIZE = 5 * 1920 * 1080; // 2MB in bytes

                      if (file) {
                        if (file.size > MAX_IMAGE_SIZE) {
                          alert(
                            "Image size exceeds 2MB. Please choose a smaller image."
                          );
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData({ ...formData, image: reader.result }); // Save the Base64 image
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {/* Image Preview */}
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">Change Item Photo</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">
                  Or Enter Image Link:
                </label>
                <input
                  type="text"
                  name="imageLink"
                  placeholder="Enter image URL"
                  value={formData.imageLink}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer with Buttons */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end gap-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProductPopUp;
