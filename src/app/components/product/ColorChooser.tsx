'use client'

import React from "react";
import { availableColors } from "../../types/products";

interface ColorChooserType {
    setSelectedColor: React.Dispatch<React.SetStateAction<string>>,
    selectedColor: string
}

const ColorChooser = ({selectedColor, setSelectedColor}: ColorChooserType) => {

  return (
    <div className="px-4 pb-2 flex space-x-2">
      {availableColors.map((color) => (
        <button
          key={color.value}
          onClick={() => setSelectedColor(color.name)}
          className={`w-6 h-6 rounded-full border-2 ${
            selectedColor === color.name ? "border-emerald-600 scale-125" : "border-gray-300"
          }`}
          style={{ backgroundColor: color.value }}
        />
      ))}
    </div>
  );
};

export default ColorChooser;
