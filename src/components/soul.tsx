import { useEffect, useRef, useState } from "react";
import PixelCanvasComponent from "./pixel-canvas";

export default function Soul() {
  const [selectedColor, setSelectedColor] = useState("#ff00ff");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between bg-black text-gray-300 font-mono overflow-hidden">
      {/* <CrtOverlay /> */}

      <header className="w-full py-4 px-6 flex justify-center items-center border-b border-gray-800 bg-black/80 z-10">
        {/* <GlitchText text="ECHO" className="text-3xl font-light tracking-widest text-purple-500" /> */}
      </header>

      <div className="flex flex-col md:flex-row w-full flex-1 p-4 gap-4 z-10">
        {/*  Pixel Canvas */}
        <div className="md:w-1/2 flex-1 flex flex-col items-center justify-center">
          <div className="relative w-full h-full mx-auto">
            <PixelCanvasComponent selectedColor={selectedColor} />
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="md:w-1/4 bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
          <h2 className="text-sm uppercase tracking-wider mb-4 text-gray-500 border-b border-gray-800 pb-2">
            Communication Terminal
          </h2>
          {/* <ChatInterface /> */}
        </div>
      </div>

      <footer className="w-full py-2 px-6 border-t border-gray-800 bg-black/80 text-xs text-gray-600 z-10">
        <div className="flex justify-between">
          <span>© 2025 ECHO SYSTEMS</span>
          <span className="text-red-500 animate-pulse">
            UNAUTHORIZED ACCESS DETECTED
          </span>
        </div>
      </footer>
    </div>
  );
}
