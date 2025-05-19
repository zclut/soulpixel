import { listenToGridChanges } from "@/lib/supabase";
import { insertPixel } from "@/services/api";
import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Download, Shrink, ZoomIn, ZoomOut } from "lucide-react";

import { CANVAS_LIMITS, CELL_SIZE, COOLDOWN_DURATION } from "@/lib/const";
import { grid, setInitialGrid, type PixelInfo } from "@/store";
import { useStore } from "@nanostores/react";
import useIsAdmin from "@/hooks/userIsAdmin";

interface PixelCanvasProps {
  activeColor: string;
  username: string;
  initialGrid: any[];
  cooldown: number;
  setCooldown: React.Dispatch<React.SetStateAction<number>>;
}

export default function PixelCanvas({
  activeColor,
  cooldown,
  setCooldown,
  username,
  initialGrid,
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const $grid = useStore(grid);
  const [pendingPixels, setPendingPixels] = useState<Map<string, PixelInfo>>(
    new Map()
  );
  const [hoveredCell, setHoveredCell] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.4);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchMode, setTouchMode] = useState<"draw" | "move">("draw");
  const lastTouchTime = useRef<number>(0);
  const touchStartPosition = useRef<{ x: number; y: number } | null>(null);
  const isAdmin = useIsAdmin();
  const defaultCooldown = isAdmin ? 0 : COOLDOWN_DURATION;

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    setInitialGrid(initialGrid);
  }, []);

  const handleNewPixel = (newPixel: any) => {
    const { x, y } = newPixel;
    const key = `${x},${y}`;

    setPendingPixels((prev) => {
      const newPending = new Map(prev);
      newPending.delete(key);
      return newPending;
    });
  };

  useEffect(() => {
    listenToGridChanges((newPixel: any) => {
      handleNewPixel(newPixel);
    }, username);
  }, []);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
    ctx.scale(zoom, zoom);

    const borderWidth =
      (CANVAS_LIMITS.maxX - CANVAS_LIMITS.minX + 1) * CELL_SIZE;
    const borderHeight =
      (CANVAS_LIMITS.maxY - CANVAS_LIMITS.minY + 1) * CELL_SIZE;
    const borderX = CANVAS_LIMITS.minX * CELL_SIZE;
    const borderY = CANVAS_LIMITS.minY * CELL_SIZE;

    ctx.fillStyle = "#222222";
    ctx.fillRect(borderX, borderY, borderWidth, borderHeight);

    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 2 / zoom;
    ctx.strokeRect(borderX, borderY, borderWidth, borderHeight);

    const combinedGrid = new Map($grid);
    pendingPixels.forEach((color, key) => {
      combinedGrid.set(key, color);
    });
    const pixelsByColor = new Map<string, { x: number; y: number }[]>();

    combinedGrid.forEach(({ color }, key) => {
      const [x, y] = key.split(",").map(Number);

      if (isWithinLimits(x, y)) {
        if (!pixelsByColor.has(color)) {
          pixelsByColor.set(color, []);
        }
        pixelsByColor.get(color)?.push({ x, y });
      }
    });

    pixelsByColor.forEach((pixels, color) => {
      ctx.fillStyle = color;

      pixels.forEach(({ x, y }) => {
        ctx.fillRect(
          x * CELL_SIZE,
          y * CELL_SIZE,
          CELL_SIZE + 0.5 / zoom,
          CELL_SIZE + 0.5 / zoom
        );
      });
    });

    if (
      hoveredCell &&
      isWithinLimits(hoveredCell.x, hoveredCell.y) &&
      cooldown <= 0 &&
      (!isTouchDevice || touchMode === "draw")
    ) {
      const gridRadius = 5;

      ctx.strokeStyle = "#333333";
      ctx.lineWidth = 0.5 / zoom;

      for (let i = -gridRadius; i <= gridRadius; i++) {
        for (let j = -gridRadius; j <= gridRadius; j++) {
          const x = hoveredCell.x + i;
          const y = hoveredCell.y + j;

          if (isWithinLimits(x, y)) {
            ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      }

      ctx.strokeStyle = "#b280ff";
      ctx.lineWidth = 2 / zoom;
      ctx.strokeRect(
        hoveredCell.x * CELL_SIZE,
        hoveredCell.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }

    ctx.restore();
  };

  const isWithinLimits = (x: number, y: number): boolean => {
    return (
      x >= CANVAS_LIMITS.minX &&
      x <= CANVAS_LIMITS.maxX &&
      y >= CANVAS_LIMITS.minY &&
      y <= CANVAS_LIMITS.maxY
    );
  };

  useEffect(() => {
    drawCanvas();
  }, [$grid, pendingPixels, hoveredCell, offset, zoom, touchMode]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      drawCanvas();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const preventScroll = (e: Event) => {
      try {
        e.preventDefault();
      } catch (error) {}
    };

    const container = containerRef.current;

    if (container) {
      container.addEventListener("wheel", preventScroll, { passive: false });
      container.addEventListener("touchmove", preventScroll, {
        passive: false,
      });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", preventScroll);
        container.removeEventListener("touchmove", preventScroll);
      }
    };
  }, []);

  const clientToGrid = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const gridX = Math.floor(
      ((mouseX - canvas.width / 2) / zoom - offset.x / zoom) / CELL_SIZE
    );
    const gridY = Math.floor(
      ((mouseY - canvas.height / 2) / zoom - offset.y / zoom) / CELL_SIZE
    );

    return { x: gridX, y: gridY };
  };

  const placePixel = async (x: number, y: number) => {
    if (cooldown > 0) {
      return;
    }

    if (isWithinLimits(x, y)) {
      const key = `${x},${y}`;

      setCooldown(defaultCooldown);

      setPendingPixels((prev) => {
        const newPending = new Map(prev);
        newPending.set(key, {
          color: activeColor,
          user: username,
          created_at: new Date().toUTCString(),
        });
        return newPending;
      });

      try {
        const pixel = $grid.get(key);
        if (pixel && pixel.user === username && pixel.color === activeColor) {
          setCooldown(0);
          return;
        }
        await insertPixel(x, y, activeColor);
        setCooldown(defaultCooldown);
      } catch (error) {
        console.error("Error al colocar el píxel:", error);
        setPendingPixels((prev) => {
          const newPending = new Map(prev);
          newPending.delete(key);
          return newPending;
        });
        setCooldown(0);
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isTouchDevice) return;

    const gridPos = clientToGrid(e.clientX, e.clientY);
    if (!gridPos) return;

    setHoveredCell(gridPos);

    if (isDragging) {
      const dx = e.clientX - lastPosition.x;
      const dy = e.clientY - lastPosition.y;

      setOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      setLastPosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isTouchDevice) return;

    if (e.button === 0) {
      const gridPos = clientToGrid(e.clientX, e.clientY);
      if (gridPos) {
        placePixel(gridPos.x, gridPos.y);
      }
    } else if (e.button === 2 || e.button === 1) {
      e.preventDefault();
      setIsDragging(true);
      setLastPosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isTouchDevice) return;
    setIsDragging(false);
  };

  const handleCanvasMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isTouchDevice) return;
    setHoveredCell(null);
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    try {
      e.preventDefault();
    } catch (error) {}

    const delta = -e.deltaY * 0.001;
    const newZoom = Math.max(0.1, Math.min(10, zoom + delta * zoom));

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const canvasX = mouseX - rect.width / 2;
    const canvasY = mouseY - rect.height / 2;

    setOffset((prev) => ({
      x: prev.x - (canvasX * (newZoom - zoom)) / zoom,
      y: prev.y - (canvasY * (newZoom - zoom)) / zoom,
    }));

    setZoom(newZoom);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    if (e.touches.length === 0) return;

    const touch = e.touches[0];
    const now = Date.now();

    touchStartPosition.current = { x: touch.clientX, y: touch.clientY };

    if (now - lastTouchTime.current < 300) {
      setTouchMode((prev) => (prev === "draw" ? "move" : "draw"));
      touchStartPosition.current = null;
      lastTouchTime.current = 0;
      return;
    }

    lastTouchTime.current = now;

    if (touchMode === "move") {
      setIsDragging(true);
      setLastPosition({
        x: touch.clientX,
        y: touch.clientY,
      });
      return;
    }

    const gridPos = clientToGrid(touch.clientX, touch.clientY);
    if (gridPos) {
      setHoveredCell(gridPos);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    if (e.touches.length === 0) return;

    const touch = e.touches[0];

    if (touchMode === "move") {
      if (isDragging) {
        const dx = touch.clientX - lastPosition.x;
        const dy = touch.clientY - lastPosition.y;

        setOffset((prev) => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }));

        setLastPosition({
          x: touch.clientX,
          y: touch.clientY,
        });
      }
      return;
    }

    const gridPos = clientToGrid(touch.clientX, touch.clientY);
    if (gridPos) {
      setHoveredCell(gridPos);
    }

    if (touchStartPosition.current) {
      const dx = touch.clientX - touchStartPosition.current.x;
      const dy = touch.clientY - touchStartPosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 10) {
        touchStartPosition.current = null;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    if (touchMode === "move" && isDragging) {
      setIsDragging(false);
      return;
    }

    const now = Date.now();

    if (
      touchMode === "draw" &&
      touchStartPosition.current &&
      hoveredCell &&
      now - lastTouchTime.current > 300
    ) {
      placePixel(hoveredCell.x, hoveredCell.y);
    }

    touchStartPosition.current = null;
  };

  const handleTouchCancel = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDragging(false);
    touchStartPosition.current = null;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const centerCanvas = () => {
    setOffset({ x: 0, y: 0 });
    setZoom(1);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    const { minX, maxX, minY, maxY } = CANVAS_LIMITS;
    const width = (maxX - minX + 1) * CELL_SIZE;
    const height = (maxY - minY + 1) * CELL_SIZE;

    tempCanvas.width = width;
    tempCanvas.height = height;

    tempCtx.fillStyle = "#1a1a1a";
    tempCtx.fillRect(0, 0, width, height);

    const combinedGrid = new Map($grid);
    pendingPixels.forEach((color, key) => {
      combinedGrid.set(key, color);
    });

    combinedGrid.forEach(({ color }, key) => {
      const [x, y] = key.split(",").map(Number);
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        const drawX = (x - minX) * CELL_SIZE;
        const drawY = (y - minY) * CELL_SIZE;

        tempCtx.fillStyle = color;
        tempCtx.fillRect(drawX, drawY, CELL_SIZE, CELL_SIZE);
      }
    });

    const padding = 8;
    const fontSize = 26;
    tempCtx.font = `${fontSize}px sans-serif`;
    tempCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
    tempCtx.textAlign = "right";
    tempCtx.textBaseline = "bottom";
    tempCtx.fillText("SOUL PIXEL", width - padding, height - padding);

    const link = document.createElement("a");
    link.download = "pixel_canvas_area.png";
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-black relative"
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleCanvasMouseMove}
        onMouseDown={handleCanvasMouseDown}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseLeave}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        className={`w-full h-full ${
          isDragging
            ? "cursor-grabbing"
            : cooldown > 0
            ? "cursor-not-allowed"
            : "cursor-crosshair"
        }`}
      />

      {/* Controles de navegación */}
      <div className="absolute bottom-2 left-2 flex flex-col gap-2 bg-black/70 p-2 rounded-sm border border-purple-900/50 text-xs">
        <div className="flex gap-2">
          <button
            className="bg-purple-900/30 hover:bg-purple-900/50 px-2 py-1 rounded-sm"
            onClick={() => setZoom((prev) => Math.min(10, prev * 1.2))}
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            className="bg-purple-900/30 hover:bg-purple-900/50 px-2 py-1 rounded-sm"
            onClick={() => setZoom((prev) => Math.max(0.1, prev / 1.2))}
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            className="bg-purple-900/30 hover:bg-purple-900/50 px-2 py-1 rounded-sm"
            onClick={centerCanvas}
            title="Center"
          >
            <Shrink size={16} />
          </button>
        </div>
      </div>

      {/* Download actual canvas button */}
      <div className="absolute top-2 right-2 flex gap-2 bg-black/70 p-2 rounded-sm border border-purple-900/50 text-xs">
        <button
          className="bg-purple-900/30 hover:bg-purple-900/50 px-2 py-1 rounded-sm"
          onClick={downloadCanvas}
          title="Download"
        >
          <Download size={16} />
        </button>
      </div>

      {/* Información de navegación */}
      <div className="absolute top-2 left-2 text-xs bg-black/70 rounded-sm border border-purple-900/50 p-1">
        <div className="mt-1">
          {isTouchDevice ? (
            <>
              Mode: {touchMode === "draw" ? "Draw" : "Move"} (Doble touch for
              change)
            </>
          ) : (
            <>Left: Draw | Right: Move | Scroll: Zoom</>
          )}
        </div>
        <div className="flex justify-between">
          <div>Zoom: {zoom.toFixed(1)}x</div>
          {hoveredCell && (
            <div
              className={`${
                !isWithinLimits(hoveredCell.x, hoveredCell.y)
                  ? "hidden"
                  : "block"
              }`}
            >
              X,Y: ({hoveredCell.x}, {hoveredCell.y})
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
