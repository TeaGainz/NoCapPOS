import React, { useState } from "react";

const capitalizeCategory = (cat) => {
  if (!cat) return "";
  return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
};

const AdminEditProductPopUp = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    ...product,
    category: capitalizeCategory(product.category),
    imageLink: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const MAX_IMAGE_SIZE = 15 * 1920 * 1080; // Increased to ~30MB

    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        alert("Image size exceeds 30MB. Please choose a smaller image.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for price and quantity
    if (Number(formData.price) < 0) {
      alert("Price cannot be negative.");
      return;
    }
    if (Number(formData.quantity) < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    // Prepare all images
    const finalFormData = {
      ...formData,
      image: formData.image || formData.imageLink,
      altImage: formData.altImage || "",
      imageRender1: formData.imageRender1 || "",
      imageRender2: formData.imageRender2 || "",
      imageRender3: formData.imageRender3 || "",
      imageRender4: formData.imageRender4 || "",
      imageRender5: formData.imageRender5 || "",
      imageRender6: formData.imageRender6 || "",
    };

    try {
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

      const response = await fetch(
        `http://localhost:5000/api/${endpoint}/${product._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalFormData),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Product updated successfully!");
        onProductUpdated(data.data);
        onClose();
      } else {
        throw new Error(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    }
  };

  // Render fields dynamically based on the selected category
  const renderCategoryFields = () => {
    switch (formData.category) {
      case "Keyboard":
        return (
          <>
            <div className="block font-extrabold mb-1">
              Category specific details
            </div>
            <div></div>
            <div>
              <label className="block font-bold mb-1">Year Released:</label>
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
              <label className="block font-bold mb-1">Case Dimensions:</label>
              <input
                type="text"
                name="dimensions"
                placeholder="Enter Length x Width"
                value={formData.dimensions || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Switch Option:</label>
              <select
                name="switchOptions"
                value={formData.switchOptions || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Switch Option --</option>
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
                <option value="ISO DE">ISO DE</option>
                <option value="ISO UK">ISO UK</option>
                <option value="ISO ES">ISO ES</option>
                <option value="ISO NOR">ISO NOR</option>
                <option value="ISO Nordic">ISO Nordic</option>
                <option value="JIS">JIS</option>
                <option value="ISO FR">ISO FR</option>
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
                <option value="Plate Mount">Plate Mount</option>
                <option value="Tray Mount">Tray Mount</option>
                <option value="Bottom Mount">Bottom Mount</option>
                <option value="PCB Mount">PCB Mount</option>
                <option value="Sandwich Mount">Sandwich Mount</option>
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
                <option value="PC">PC</option>
                <option value="Wood">Wood</option>
                <option value="Ceramic">Ceramic</option>
                <option value="Aluminum">Aluminum</option>
                <option value="Stainless Steel">Stainless Steel</option>
                <option value="Zinc Alloy">Zinc Alloy</option>
                <option value="No Info">No Info</option>
              </select>
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
                name="winmacSupport"
                value={formData.winmacSupport || ""}
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
              Category specific details
            </div>
            <div></div>
            <div>
              <label className="block font-bold mb-1">Year Released:</label>
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
            <div>
              <label className="block font-bold mb-1">Switch Profile:</label>
              <select
                name="switchProfile"
                value={formData.switchProfile || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Switch Profile--</option>
                <option value="Normal">Normal</option>
                <option value="Low-Profile">Low-Profile</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">
                Factory Lubed Status:
              </label>
              <select
                name="isFactoryLubed"
                value={formData.isFactoryLubed || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Factory Lubed Status --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">
                Is the switch Hall Effect:?
              </label>
              <select
                name="isHallEffect"
                value={formData.isHallEffect || ""}
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
              <label className="block font-bold mb-1">
                Is the switch Long Pole?:
              </label>
              <select
                name="isLongPole"
                value={formData.isLongPole || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Whether Long Pole --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="actuationForce" className="block font-bold mb-1">
                Actuation Force:{" "}
                <span className="text-blue-600">
                  {formData.actuationForce ?? 0} g
                </span>
              </label>
              <input
                type="range"
                id="actuationForce"
                name="actuationForce"
                min="0"
                max="100"
                step="1"
                value={formData.actuationForce ?? 0}
                onChange={(e) => {
                  // parse to number so you don't end up with a string
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    actuationForce: val,
                  }));
                }}
                className="w-full h-2 bg-gray-200 rounded-lg accent-blue-500 cursor-pointer"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="bottomOutForce" className="block font-bold mb-1">
                Bottom out Force:{" "}
                <span className="text-blue-600">
                  {formData.bottomOutForce ?? 0} g
                </span>
              </label>
              <input
                type="range"
                id="bottomOutForce"
                name="bottomOutForce"
                min="0"
                max="500"
                step="1"
                value={formData.bottomOutForce ?? 0}
                onChange={(e) => {
                  // parse to number so you don't end up with a string
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    bottomOutForce: val,
                  }));
                }}
                className="w-full h-2 bg-gray-200 rounded-lg accent-blue-500 cursor-pointer"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="preTravel" className="block font-bold mb-1">
                Pre-Travel:{" "}
                <span className="text-blue-600">
                  {formData.preTravel ?? 0} mm
                </span>
              </label>
              <input
                type="range"
                id="preTravel"
                name="preTravel"
                min="0"
                max="4"
                step=".01"
                value={formData.preTravel ?? 0}
                onChange={(e) => {
                  // parse to number so you don't end up with a string
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    preTravel: val,
                  }));
                }}
                className="w-full h-2 bg-gray-200 rounded-lg accent-blue-500 cursor-pointer"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="totalTravel" className="block font-bold mb-1">
                Total Travel:{" "}
                <span className="text-blue-600">
                  {formData.totalTravel ?? 0} mm
                </span>
              </label>
              <input
                type="range"
                id="totalTravel"
                name="totalTravel"
                min="0"
                max="4.5"
                step=".01"
                value={formData.totalTravel ?? 0}
                onChange={(e) => {
                  // parse to number so you don't end up with a string
                  const val = Number(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    totalTravel: val,
                  }));
                }}
                className="w-full h-2 bg-gray-200 rounded-lg accent-blue-500 cursor-pointer"
              />
            </div>
          </>
        );
      case "Keycaps":
        return (
          <>
            <div className="block font-extrabold mb-1">
              Category specific details
            </div>
            <div></div>
            <div>
              <label className="block font-bold mb-1">Year Released:</label>
              <input
                type="text"
                name="releaseYear"
                placeholder="YYYY"
                value={formData.releaseYear || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Keycap Profile:</label>
              <select
                name="profile"
                value={formData.profile || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Keycap Profile--</option>
                <option value="Cherry">Cherry</option>
                <option value="OEM">OEM</option>
                <option value="SA">SA</option>
                <option value="XDA">XDA</option>
                <option value="ASA">ASA</option>
                <option value="KAT">KAT</option>
                <option value="DSA">DSA</option>
                <option value="MOA">MOA</option>
                <option value="MAO">MAO</option>
                <option value="MDA">MDA</option>
                <option value="OSA">OSA</option>
                <option value="SOA">SOA</option>
                <option value="KDA">KDA</option>
                <option value="KAM">KAM</option>
                <option value="KSA">KSA</option>
                <option value="GSA">GSA</option>
                <option value="JDA">JDA</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Keycap Material:</label>
              <select
                name="material"
                value={formData.material || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Keycap Material --</option>
                <option value="PBT">PBT</option>
                <option value="ABS">ABS</option>
                <option value="PC">PC</option>
                <option value="Wood">Wood</option>
                <option value="Ceramic">Ceramic</option>
                <option value="Aluminum">Aluminum</option>
                <option value="Stainless Steel">Stainless Steel</option>
                <option value="Zinc Alloy">Zinc Alloy</option>
                <option value="No Info">No Info</option>
              </select>
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
                <option value="ISO DE">ISO DE</option>
                <option value="ISO UK">ISO UK</option>
                <option value="ISO ES">ISO ES</option>
                <option value="ISO NOR">ISO NOR</option>
                <option value="ISO Nordic">ISO Nordic</option>
                <option value="ISO FR">ISO FR</option>
                <option value="JIS">JIS</option>
                <option value="No Info">No Info</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Sub-Legends:</label>
              <select
                name="subLegends"
                value={formData.subLegends || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select Sub-Legends --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Japanese">Japanese</option>
                <option value="Hiragana">Hiragana</option>
                <option value="Katakana">Katakana</option>
                <option value="Kanji">Kanji</option>
                <option value="Hangul">Hangul</option>
                <option value="Cyrillic">Cyrillic</option>
                <option value="Zhuyin">Zhuyin</option>
                <option value="Cangjie">Cangjie</option>
                <option value="No Info">No Info</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">RGB Shine Through:</label>
              <select
                name="rgbShineThrough"
                value={formData.rgbShineThrough || ""}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required="false"
              >
                <option value="">-- Select RGB Shine Through --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No Info">No Info</option>
              </select>
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
          <h2 className="text-2xl font-bold">Edit Product</h2>
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
                  required
                  disabled // Prevent changing category on edit
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {/* Image Preview */}
                  {formData.image ? (
                    <>
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            image: "",
                            imageLink: "",
                          }))
                        }
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500">Change Item Photo</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">
                  Or Enter Image Link:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="imageLink"
                    placeholder="Enter image URL"
                    value={formData.imageLink}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                  {formData.imageLink && (
                    <button
                      type="button"
                      className="bg-red-500 text-white rounded px-2 py-1 text-xs"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, imageLink: "" }))
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
                {/* Optional: Show preview if imageLink is present and no image */}
                {formData.imageLink && !formData.image && (
                  <img
                    src={formData.imageLink}
                    alt="Preview"
                    className="w-24 h-24 object-cover mt-2 rounded"
                  />
                )}
              </div>

              <div className="flex flex-col items-center">
                <label>Alternate Image</label>
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex justify-center items-center relative overflow-hidden">
                  <input
                    type="file"
                    accept="altImage/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const MAX_ALT_IMAGE_SIZE = 15 * 1920 * 1080; // Increased to ~30MB

                      if (file) {
                        if (file.size > MAX_ALT_IMAGE_SIZE) {
                          alert(
                            "Image size exceeds 30MB. Please choose a smaller image."
                          );
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData({ ...formData, altImage: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {/* Image Preview */}
                  {formData.altImage ? (
                    <>
                      <img
                        src={formData.altImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            altImage: "",
                            imageLink: "",
                          }))
                        }
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500">Change Alt Item Photo</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <label>1st Render Image</label>
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex justify-center items-center relative overflow-hidden">
                  <input
                    type="file"
                    accept="imageRender1/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const MAX_R1_IMAGE_SIZE = 15 * 1920 * 1080; // Increased to ~30MB

                      if (file) {
                        if (file.size > MAX_R1_IMAGE_SIZE) {
                          alert(
                            "Image size exceeds 30MB. Please choose a smaller image."
                          );
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData({
                            ...formData,
                            imageRender1: reader.result,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {/* Image Preview */}
                  {formData.imageRender1 ? (
                    <>
                      <img
                        src={formData.imageRender1}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            imageRender1: "",
                            imageLink: "",
                          }))
                        }
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500">
                      Change Render Item Photo
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <label>2nd Render Image</label>
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex justify-center items-center relative overflow-hidden">
                  <input
                    type="file"
                    accept="imageRender2/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const MAX_R2_IMAGE_SIZE = 15 * 1920 * 1080; // Increased to ~30MB

                      if (file) {
                        if (file.size > MAX_R2_IMAGE_SIZE) {
                          alert(
                            "Image size exceeds 30MB. Please choose a smaller image."
                          );
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData({
                            ...formData,
                            imageRender2: reader.result,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {/* Image Preview */}
                  {formData.imageRender2 ? (
                    <>
                      <img
                        src={formData.imageRender2}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            imageRender2: "",
                            imageLink: "",
                          }))
                        }
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500">
                      Change Render Item Photo
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <label>3rd Render Image</label>
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex justify-center items-center relative overflow-hidden">
                  <input
                    type="file"
                    accept="imageRender3/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const MAX_R3_IMAGE_SIZE = 15 * 1920 * 1080; // Increased to ~30MB

                      if (file) {
                        if (file.size > MAX_R3_IMAGE_SIZE) {
                          alert(
                            "Image size exceeds 30MB. Please choose a smaller image."
                          );
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData({
                            ...formData,
                            imageRender3: reader.result,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {/* Image Preview */}
                  {formData.imageRender3 ? (
                    <>
                      <img
                        src={formData.imageRender3}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            imageRender3: "",
                            imageLink: "",
                          }))
                        }
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500">
                      Change Render Item Photo
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <label>4th Render Image</label>
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex justify-center items-center relative overflow-hidden">
                  <input
                    type="file"
                    accept="imageRender4/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const MAX_R4_IMAGE_SIZE = 15 * 1920 * 1080; // Increased to ~30MB

                      if (file) {
                        if (file.size > MAX_R4_IMAGE_SIZE) {
                          alert(
                            "Image size exceeds 30MB. Please choose a smaller image."
                          );
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData({
                            ...formData,
                            imageRender4: reader.result,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {/* Image Preview */}
                  {formData.imageRender4 ? (
                    <>
                      <img
                        src={formData.imageRender4}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            imageRender4: "",
                            imageLink: "",
                          }))
                        }
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500">
                      Change Render Item Photo
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <label>5th Render Image</label>
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex justify-center items-center relative overflow-hidden">
                  <input
                    type="file"
                    accept="imageRender5/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const MAX_R5_IMAGE_SIZE = 15 * 1920 * 1080; // Increased to ~30MB

                      if (file) {
                        if (file.size > MAX_R5_IMAGE_SIZE) {
                          alert(
                            "Image size exceeds 30MB. Please choose a smaller image."
                          );
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData({
                            ...formData,
                            imageRender5: reader.result,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {/* Image Preview */}
                  {formData.imageRender5 ? (
                    <>
                      <img
                        src={formData.imageRender5}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            imageRender5: "",
                            imageLink: "",
                          }))
                        }
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500">
                      Change Render Item Photo
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <label>6th Render Image</label>
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex justify-center items-center relative overflow-hidden">
                  <input
                    type="file"
                    accept="imageRender6/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const MAX_R6_IMAGE_SIZE = 15 * 1920 * 1080; // Increased to ~30MB

                      if (file) {
                        if (file.size > MAX_R6_IMAGE_SIZE) {
                          alert(
                            "Image size exceeds 30MB. Please choose a smaller image."
                          );
                          return;
                        }

                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData({
                            ...formData,
                            imageRender6: reader.result,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {/* Image Preview */}
                  {formData.imageRender6 ? (
                    <>
                      <img
                        src={formData.imageRender6}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded px-2 py-1 text-xs"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            imageRender6: "",
                            imageLink: "",
                          }))
                        }
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500">
                      Change Render Item Photo
                    </span>
                  )}
                </div>
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
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProductPopUp;
