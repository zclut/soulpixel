import { useState } from "react";
import { Palette } from "lucide-react";

interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorSelector({
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const colors = ["#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00"];

  return (
    <div>
      <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-6 p-4">
        {/* Color preview */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <div
              className="w-20 h-20 rounded-full border-4 border-gray-800 transition-all duration-300"
              style={{
                backgroundColor: selectedColor,
                boxShadow: `0 0 20px ${selectedColor}, 0 0 40px ${selectedColor}33`,
              }}
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-900 px-2 py-1 text-xs rounded-sm">
              {selectedColor}
            </div>
          </div>
        </div>

        {/* Horizontal color row */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {colors.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-full border-2 border-gray-800 hover:scale-110 transition-transform"
              style={{
                backgroundColor: color,
                boxShadow:
                  selectedColor === color
                    ? `0 0 12px ${color}, 0 0 24px ${color}`
                    : `0 0 4px ${color}99`,
              }}
              onClick={() => onColorChange(color)}
            />
          ))}
        </div>
      </div>
      <button
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-purple-500 transition-colors mt-2"
        onClick={() => setShowCustomPicker(!showCustomPicker)}
      >
        <Palette size={14} />
        <span>{showCustomPicker ? "HIDE CUSTOM" : "CUSTOM COLOR"}</span>
      </button>

      {/* Custom color picker */}
      {showCustomPicker && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-md border border-gray-700 w-full">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full h-8 bg-transparent cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
