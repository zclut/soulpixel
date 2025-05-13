import { useState } from "react";
import PixelCanvasComponent from "@/components/react/PixelCanvas";
import { insertPixel } from "@/services/api";
import Footer from "@/components/Footer";
import Header from '@/components/Header';

interface Props {
  initialGrid: any[];
}

export default function Panel({ initialGrid }: Props) {
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  return (
    <>
      <Header />

      <div className="flex flex-col md:flex-row w-full flex-1 gap-4 z-10">
        {/*  Pixel Canvas */}
        <div className="md:w-1/2 flex-1 flex flex-col items-center justify-center">
          <div className="relative w-full h-full mx-auto">
            <PixelCanvasComponent
              initialGrid={initialGrid}
              selectedColor={selectedColor}
              onPixelClick={(x, y, color) => insertPixel(x, y, color)}
            />
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="md:w-1/4 bg-gray-900/60 backdrop-blur-sm rounded-lg p-4"> 
          <h2 className="text-sm uppercase tracking-wider mb-4 text-gray-500 border-b border-gray-800 pb-2">
            Communication Terminal
          </h2>
          <div>CHAT HERE</div>
        </div>
      </div>

      <Footer selectedColor={selectedColor} onColorChange={setSelectedColor} />
    </>
  );
}
