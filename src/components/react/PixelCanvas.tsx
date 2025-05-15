import { listenToGridChanges } from "@/lib/supabase";
import { insertPixel } from "@/services/api";
import { addFeedStore } from "@/utils/feed.store";
import type React from "react";

import { useState, useEffect, useRef } from "react";

interface PixelCanvasProps {
  activeColor: string;
  initialGrid: any[];
  username: string;
}

export default function PixelCanvas({
  activeColor,
  initialGrid,
  username,
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState<Map<string, string>>(new Map());
  const [pendingPixels, setPendingPixels] = useState<Map<string, string>>(
    new Map()
  );
  const [hoveredCell, setHoveredCell] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Definir límites del canvas (área donde se pueden colocar píxeles)
  const canvasLimits = {
    minX: -128,
    maxX: 128,
    minY: -64,
    maxY: 64,
  };

  // Tamaño de la celda
  const cellSize = 10;

  useEffect(() => {
    const newGrid = new Map<string, string>();
    initialGrid.forEach(({ x, y, color }) => {
      newGrid.set(`${x},${y}`, color);
    });
    setGrid(newGrid);
  }, [initialGrid]);

  const handleNewPixel = (newPixel: {
    x: number;
    y: number;
    color: string;
  }) => {
    const { x, y, color } = newPixel;
    const key = `${x},${y}`;

    setGrid((prevGrid) => {
      const newGrid = new Map(prevGrid);
      let oldPixel = newGrid;
      addFeedStore(newPixel as any, username);

      newGrid.set(key, color);
      return newGrid;
    });

    setPendingPixels((prev) => {
      const newPending = new Map(prev);
      newPending.delete(key);
      return newPending;
    });
  };

  useEffect(() => {
    listenToGridChanges((newPixel: any) => {
      handleNewPixel(newPixel);
    });
  }, []);

  // Función para dibujar el canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Limpiar canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);

    // Aplicar transformaciones
    ctx.save();
    ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
    ctx.scale(zoom, zoom);

    // Dibujar el borde del área permitida
    const borderWidth = (canvasLimits.maxX - canvasLimits.minX + 1) * cellSize;
    const borderHeight = (canvasLimits.maxY - canvasLimits.minY + 1) * cellSize;
    const borderX = canvasLimits.minX * cellSize;
    const borderY = canvasLimits.minY * cellSize;

    // Dibujar fondo del área permitida (ligeramente más claro)
    ctx.fillStyle = "#222222";
    ctx.fillRect(borderX, borderY, borderWidth, borderHeight);

    // Dibujar borde del área permitida
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 2 / zoom;
    ctx.strokeRect(borderX, borderY, borderWidth, borderHeight);

    // Optimización: Agrupar píxeles por color para reducir cambios de contexto
    const combinedGrid = new Map(grid);
    pendingPixels.forEach((color, key) => {
      combinedGrid.set(key, color);
    });
    const pixelsByColor = new Map<string, { x: number; y: number }[]>();

    combinedGrid.forEach((color, key) => {
      const [x, y] = key.split(",").map(Number);

      if (isWithinLimits(x, y)) {
        if (!pixelsByColor.has(color)) {
          pixelsByColor.set(color, []);
        }
        pixelsByColor.get(color)?.push({ x, y });
      }
    });

    // Dibujar píxeles agrupados por color
    pixelsByColor.forEach((pixels, color) => {
      ctx.fillStyle = color;

      // Dibujar cada píxel sin espacios entre ellos
      pixels.forEach(({ x, y }) => {
        // Usar un tamaño ligeramente mayor para evitar espacios entre píxeles
        ctx.fillRect(
          x * cellSize,
          y * cellSize,
          cellSize + 0.5 / zoom, // Añadir una pequeña cantidad para evitar espacios
          cellSize + 0.5 / zoom
        );
      });
    });

    // Dibujar retícula alrededor del cursor solo si está dentro de los límites
    if (hoveredCell && isWithinLimits(hoveredCell.x, hoveredCell.y)) {
      // Dibujar solo una pequeña área alrededor del cursor (5x5 celdas)
      const gridRadius = 5;

      // Primero dibujar la retícula
      ctx.strokeStyle = "#333333";
      ctx.lineWidth = 0.5 / zoom;

      for (let i = -gridRadius; i <= gridRadius; i++) {
        for (let j = -gridRadius; j <= gridRadius; j++) {
          const x = hoveredCell.x + i;
          const y = hoveredCell.y + j;

          // Solo dibujar retícula dentro de los límites
          if (isWithinLimits(x, y)) {
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }

      // Luego dibujar el borde de la celda seleccionada
      ctx.strokeStyle = "#b280ff";
      ctx.lineWidth = 2 / zoom;
      ctx.strokeRect(
        hoveredCell.x * cellSize,
        hoveredCell.y * cellSize,
        cellSize,
        cellSize
      );
    }

    ctx.restore();
  };

  // Verificar si una coordenada está dentro de los límites
  const isWithinLimits = (x: number, y: number): boolean => {
    return (
      x >= canvasLimits.minX &&
      x <= canvasLimits.maxX &&
      y >= canvasLimits.minY &&
      y <= canvasLimits.maxY
    );
  };

  // Dibujar el canvas cuando cambian las dependencias
  useEffect(() => {
    drawCanvas();
  }, [grid, pendingPixels, hoveredCell, offset, zoom]);

  // Manejar resize del canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      // Establecer el tamaño del canvas al tamaño del contenedor
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      drawCanvas();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Convertir coordenadas del mouse a coordenadas del grid
  const mouseToGrid = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    // Obtener la posición exacta del mouse relativa al canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Aplicar transformaciones inversas para obtener la posición en el grid
    const gridX = Math.floor(
      ((mouseX - canvas.width / 2) / zoom - offset.x / zoom) / cellSize
    );
    const gridY = Math.floor(
      ((mouseY - canvas.height / 2) / zoom - offset.y / zoom) / cellSize
    );

    return { x: gridX, y: gridY };
  };

  const placePixel = async (x: number, y: number) => {
    if (isWithinLimits(x, y)) {
      const key = `${x},${y}`;

      setPendingPixels((prev) => {
        const newPending = new Map(prev);
        newPending.set(key, activeColor);
        return newPending;
      });

      try {
        let result = await insertPixel(x, y, activeColor);
      } catch (error) {
        console.error("Error al colocar el píxel:", error);
        setPendingPixels((prev) => {
          const newPending = new Map(prev);
          newPending.delete(key);
          return newPending;
        });
      } finally {
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const gridPos = mouseToGrid(e);
    if (!gridPos) return;

    setHoveredCell(gridPos);

    // Manejar arrastre
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
    // Botón izquierdo: colocar píxel
    if (e.button === 0) {
      const gridPos = mouseToGrid(e);
      if (gridPos) {
        placePixel(gridPos.x, gridPos.y);
      }
    }
    // Botón derecho o central: iniciar arrastre
    else if (e.button === 2 || e.button === 1) {
      e.preventDefault();
      setIsDragging(true);
      setLastPosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasMouseLeave = () => {
    setHoveredCell(null);
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    // Calcular nuevo zoom
    const delta = -e.deltaY * 0.001;
    const newZoom = Math.max(0.1, Math.min(10, zoom + delta * zoom));

    // Ajustar offset para hacer zoom hacia el cursor
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

  // Prevenir menú contextual
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  // Centrar el canvas en el área permitida
  const centerCanvas = () => {
    setOffset({ x: 0, y: 0 });
    setZoom(1);
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
        className={`w-full h-full ${
          isDragging ? "cursor-grabbing" : "cursor-crosshair"
        }`}
      />

      {/* Controles de navegación */}
      <div className="absolute bottom-10 right-4 flex flex-col gap-2 bg-black/70 p-2 rounded-sm border border-purple-900/50 text-xs">
        <button
          className="bg-purple-900/30 hover:bg-purple-900/50 px-2 py-1 rounded-sm"
          onClick={() => setZoom((prev) => Math.min(10, prev * 1.2))}
        >
          Zoom +
        </button>
        <button
          className="bg-purple-900/30 hover:bg-purple-900/50 px-2 py-1 rounded-sm"
          onClick={() => setZoom((prev) => Math.max(0.1, prev / 1.2))}
        >
          Zoom -
        </button>
        <button
          className="bg-purple-900/30 hover:bg-purple-900/50 px-2 py-1 rounded-sm"
          onClick={centerCanvas}
        >
          Centrar
        </button>
      </div>

      {/* Información de navegación */}
      <div className="absolute bottom-2 left-2 text-xs text-purple-700 bg-black/70 p-1 rounded-sm">
        <div>Zoom: {zoom.toFixed(1)}x</div>
        {hoveredCell && (
          <div>
            Pos: ({hoveredCell.x}, {hoveredCell.y})
            {!isWithinLimits(hoveredCell.x, hoveredCell.y) && (
              <span className="text-red-500 ml-1">(fuera de límites)</span>
            )}
          </div>
        )}
        <div className="text-[10px] mt-1">
          Click: Colocar pixel | Click derecho: Mover | Rueda: Zoom
        </div>
      </div>

      {/* Indicador de límites */}
      <div className="absolute top-2 left-2 text-xs text-purple-700 bg-black/70 p-1 rounded-sm">
        <div>
          Límites: {canvasLimits.minX},{canvasLimits.minY} a {canvasLimits.maxX}
          ,{canvasLimits.maxY}
        </div>
        <div>
          Tamaño: {canvasLimits.maxX - canvasLimits.minX + 1}x
          {canvasLimits.maxY - canvasLimits.minY + 1}
        </div>
      </div>
    </div>
  );
}
