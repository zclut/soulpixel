import { useState } from "react";
import { Palette } from "lucide-react";

interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

export default function ColorSelector({
  selectedColor,
  onColorChange,
  className
}: ColorSelectorProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const colors = [
    "#ff3c00", // naranja rojizo
    "#ffa000", // naranja
    "#ffd400", // amarillo
    "#00b58b", // verde azulado
    "#2a9df4", // azul
    "#b34fc9", // púrpura
    "#000000", // negro
    "#ffffff", // blanco
  ];


  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Paleta de colores */}
      <div className="flex flex-wrap justify-center gap-2">
        {colors.map((color) => (
          <button
            key={color}
            className="w-6 h-6 cursor-pointer"
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
  );
}
