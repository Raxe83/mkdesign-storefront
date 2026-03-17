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
          className={`w-5 h-5 rounded-full border-2 transition-transform duration-150 ${
            selectedColor === color.name
              ? "border-accent scale-125"
              : "border-zinc-300 dark:border-zinc-600 hover:scale-110"
          }`}
          style={{ backgroundColor: color.value }}
        />
      ))}
    </div>
  );
};

export default ColorChooser;
