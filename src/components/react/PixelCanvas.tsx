import { listenToGridChanges } from "@/lib/supabase";
import { insertPixel } from "@/services/api";
import { addFeedStore } from "@/utils/feed.store";
import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Download, Shrink, ZoomIn, ZoomOut } from "lucide-react";

import Cooldown from "./Cooldown";
import { CANVAS_LIMITS, CELL_SIZE, COOLDOWN_DURATION } from "@/lib/const";
import { getCooldownRemaining } from "@/lib/utils";
import { grid, type PixelInfo } from "@/store";
import { useStore } from "@nanostores/react";

interface PixelCanvasProps {
  activeColor: string;
  username: string;
  lastPixelPlaced: any;
}

export default function PixelCanvas({
  activeColor,
  lastPixelPlaced,
  username,
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const $grid = useStore(grid)
  const [pendingPixels, setPendingPixels] = useState<Map<string, PixelInfo>>(new Map());
  const [hoveredCell, setHoveredCell] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cooldown, setCooldown] = useState(
    getCooldownRemaining(lastPixelPlaced.created_at ?? null)
  );

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
    const borderWidth =
      (CANVAS_LIMITS.maxX - CANVAS_LIMITS.minX + 1) * CELL_SIZE;
    const borderHeight =
      (CANVAS_LIMITS.maxY - CANVAS_LIMITS.minY + 1) * CELL_SIZE;
    const borderX = CANVAS_LIMITS.minX * CELL_SIZE;
    const borderY = CANVAS_LIMITS.minY * CELL_SIZE;

    // Dibujar fondo del área permitida (ligeramente más claro)
    ctx.fillStyle = "#222222";
    ctx.fillRect(borderX, borderY, borderWidth, borderHeight);

    // Dibujar borde del área permitida
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 2 / zoom;
    ctx.strokeRect(borderX, borderY, borderWidth, borderHeight);

    // Optimización: Agrupar píxeles por color para reducir cambios de contexto
    const combinedGrid = new Map($grid);
    pendingPixels.forEach((color, key) => {
      combinedGrid.set(key, color);
    });
    const pixelsByColor = new Map<string, { x: number; y: number }[]>();

    combinedGrid.forEach(({color}, key) => {
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
          x * CELL_SIZE,
          y * CELL_SIZE,
          CELL_SIZE + 0.5 / zoom, // Añadir una pequeña cantidad para evitar espacios
          CELL_SIZE + 0.5 / zoom
        );
      });
    });

    // Dibujar retícula alrededor del cursor solo si está dentro de los límites
    if (
      hoveredCell &&
      isWithinLimits(hoveredCell.x, hoveredCell.y) &&
      cooldown <= 0
    ) {
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
            ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      }

      // Luego dibujar el borde de la celda seleccionada
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

  // Verificar si una coordenada está dentro de los límites
  const isWithinLimits = (x: number, y: number): boolean => {
    return (
      x >= CANVAS_LIMITS.minX &&
      x <= CANVAS_LIMITS.maxX &&
      y >= CANVAS_LIMITS.minY &&
      y <= CANVAS_LIMITS.maxY
    );
  };

  // Dibujar el canvas cuando cambian las dependencias
  useEffect(() => {
    drawCanvas();
  }, [$grid, pendingPixels, hoveredCell, offset, zoom]);

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

  // Manejar zoom de afuera
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
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

      setCooldown(COOLDOWN_DURATION);

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
        await insertPixel(x, y, activeColor);
        setCooldown(COOLDOWN_DURATION);
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

    // Dibujar fondo
    tempCtx.fillStyle = "#1a1a1a";
    tempCtx.fillRect(0, 0, width, height);

    // Dibujar píxeles
    const combinedGrid = new Map($grid);
    pendingPixels.forEach((color, key) => {
      combinedGrid.set(key, color);
    });

    combinedGrid.forEach(({color}, key) => {
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

    // Descargar imagen
    const link = document.createElement("a");
    link.download = "pixel_canvas_area.png";
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  };

  // Mobile
  const getEventPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if ("touches" in e && e.touches.length > 0) {
      return {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
      };
    } else if ("clientX" in e) {
      return {
        clientX: e.clientX,
        clientY: e.clientY,
      };
    }
    return null;
  };

  const handleCanvasPointerMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const pos = getEventPos(e);
    if (!pos) return;

    const gridPos = mouseToGrid({
      clientX: pos.clientX,
      clientY: pos.clientY,
    } as React.MouseEvent<HTMLCanvasElement>);
    if (!gridPos) return;

    setHoveredCell(gridPos);

    if (isDragging) {
      const dx = pos.clientX - lastPosition.x;
      const dy = pos.clientY - lastPosition.y;

      setOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      setLastPosition({
        x: pos.clientX,
        y: pos.clientY,
      });
    }
  };

  const handleCanvasPointerDown = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const pos = getEventPos(e);
    if (!pos) return;

    const gridPos = mouseToGrid({
      clientX: pos.clientX,
      clientY: pos.clientY,
    } as React.MouseEvent<HTMLCanvasElement>);
    if (!gridPos) return;

    // Para touch solo colocamos pixel (sin botones secundarios)
    if ("touches" in e) {
      placePixel(gridPos.x, gridPos.y);
    } else if ("button" in e) {
      if (e.button === 0) {
        placePixel(gridPos.x, gridPos.y);
      } else if (e.button === 2 || e.button === 1) {
        setIsDragging(true);
        setLastPosition({ x: pos.clientX, y: pos.clientY });
      }
    }
  };

  const handleCanvasPointerUp = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleCanvasPointerCancel = (
    e: React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    setIsDragging(false);
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
        onTouchStart={handleCanvasPointerDown}
        onTouchMove={handleCanvasPointerMove}
        onTouchEnd={handleCanvasPointerUp}
        onTouchCancel={handleCanvasPointerCancel}
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

      {/* Espera para el proximo pixel */}
      <Cooldown
        cooldown={cooldown}
        setCooldown={setCooldown}
        cooldownDuration={COOLDOWN_DURATION}
      />

      {/* Información de navegación */}
      <div className="absolute top-2 left-2 text-xs bg-black/70 rounded-sm border border-purple-900/50 p-1 ">
        <div className="mt-1">Left: Draw | Right: Move | Scroll: Zoom</div>
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
