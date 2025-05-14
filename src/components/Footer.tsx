import ColorSelector from "@/components/react/ColorSelector";

interface Props {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const Footer = ({ selectedColor, onColorChange }: Props) => {
  const today = new Date();

  return (
    <footer className="w-full py-3 px-6 bg-gray-900/60"> 
      <div className="flex items-center justify-center">
        <ColorSelector
          selectedColor={selectedColor}
          onColorChange={onColorChange}
        />
      </div>
    </footer>
  );
};

export default Footer;
