interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

export default function ColorSelector({
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {

  const colors = [
    "#6B0119",
    "#BD0037",
    "#FF4500",
    "#FE3781",
    "#DD117E",
    "#FE99A9",
    "#9B6926",
    "#6D462F",
    "#FEB470",
    "#FEA800",
    "#FFD435",
    "#FEFBBB",
    "#01A267",
    "#09CC76",
    "#7EEC57",
    "#02756D",
    "#00CCBE",
    "#009DAA",
    "#52E8F3",
    "#244FA4",
    "#3790EA",
    "#94B3EF",
    "#4839BF",
    "#695BFF",
    "#801D9F",
    "#B449BF",
    "#E4ABFD",
    "#000000",
    "#525252",
    "#888D90",
    "#D5D6D8",
    "#FFFFFF",
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {colors.map((color) => (
        <button
          key={color}
          className={`w-6 h-6 rounded-md transition-transform ${selectedColor === color ? "scale-125 shadow-glow" : "hover:scale-110"}`}
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
