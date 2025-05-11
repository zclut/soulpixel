"use client";

import { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface PixelCanvasProps {
  selectedColor: string;
}

export default function PixelCanvas({ selectedColor }: PixelCanvasProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [gridSize, setGridSize] = useState(64);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize grid
  useEffect(() => {
    const newGrid = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill("transparent"));
    setGrid(newGrid);
  }, [gridSize]);

  const handlePixelClick = (rowIndex: number, colIndex: number) => {
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = selectedColor;
    setGrid(newGrid);

    // Add glitch effect to the canvas
    if (canvasRef.current) {
      canvasRef.current.classList.add("glitch-effect");
      setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.classList.remove("glitch-effect");
        }
      }, 150);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={canvasRef}
      className={`relative flex flex-col w-full h-full ${
        isFullscreen ? "fixed inset-0 z-50 bg-black p-8" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
        <div>SOUL Pixel</div>
        <button
          onClick={toggleFullscreen}
          className="p-1 hover:text-purple-500 transition-colors"
        >
          {isFullscreen ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
        </button>
      </div>

      <div className="relative flex-1 border border-gray-800 rounded-md overflow-hidden bg-black/50">
        {/* Scanlines effect */}
        <div className="absolute inset-0 pointer-events-none scanlines"></div>

        {/* Pixel grid */}
        <div
          className="absolute inset-0 grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            gap: "1px",
            padding: "1px",
            background: "#111",
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((color, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="pixel transition-colors duration-200 hover:opacity-80 cursor-crosshair"
                style={{
                  backgroundColor: color,
                  boxShadow:
                    color !== "transparent" ? `0 0 8px ${color}` : "none",
                }}
                onClick={() => handlePixelClick(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-2 flex justify-between text-xs text-gray-600">
        <div>
          RESOLUTION: {gridSize}x{gridSize}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setGridSize(Math.max(8, gridSize - 4))}
            className="hover:text-purple-500 transition-colors"
            disabled={gridSize <= 8}
          >
            -
          </button>
          <button
            onClick={() => setGridSize(Math.min(32, gridSize + 4))}
            className="hover:text-purple-500 transition-colors"
            disabled={gridSize >= 32}
          >
            +
          </button>
        </div>
      </div>

      <style>{`
        .scanlines {
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.03) 50%,
            rgba(0, 0, 0, 0.1) 50%
          );
          background-size: 100% 4px;
          z-index: 2;
        }

        .glitch-effect {
          animation: glitch 0.15s linear;
        }

        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-3px, 3px);
          }
          40% {
            transform: translate(-3px, -3px);
          }
          60% {
            transform: translate(3px, 3px);
          }
          80% {
            transform: translate(3px, -3px);
          }
          100% {
            transform: translate(0);
          }
        }

        @keyframes loading {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
