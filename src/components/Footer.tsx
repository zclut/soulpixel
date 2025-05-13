import OnlineUsers from "@/components/react/OnlineUsers";
import ColorSelector from "@/components/react/ColorSelector";

interface Props {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const Footer = ({ selectedColor, onColorChange }: Props) => {
  const today = new Date();

  return (
    <footer className="w-full py-3 px-6 bg-gray-900">
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 sm:justify-between">
        <ColorSelector
          selectedColor={selectedColor}
          onColorChange={onColorChange}
          className="block sm:hidden"
        />

        <div className="flex gap-2 sm:flex-row sm:gap-2 sm:contents justify-between">
          <span className="text-purple-400 sm:order-1">
            © {today.getFullYear()} SOUL PIXEL
          </span>
          <ColorSelector
            selectedColor={selectedColor}
            onColorChange={onColorChange}
            className="hidden sm:block sm:order-2"
          />
          <span className="text-red-500 animate-pulse sm:order-3">
            <OnlineUsers />
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
