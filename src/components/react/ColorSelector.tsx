import { COLORS } from "@/lib/const";

interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

export default function ColorSelector({
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {COLORS.map((color) => (
        <button
          key={color}
          className={`w-6 h-6 rounded-md transition-transform ${
            selectedColor === color
              ? "scale-125 shadow-glow"
              : "hover:scale-110"
          }`}
          style={{
            backgroundColor: color,
            boxShadow: selectedColor === color ? `0 0 8px ${color}` : "none",
            borderRadius: "0.2rem",
          }}
          onClick={() => onColorChange(color)}
        />
      ))}
    </div>
  );
}
