import { useState, useSyncExternalStore } from "react";
import Footer from "@/components/Footer";
import PixelCanvas from "@/components/react/PixelCanvas";
import { $userStore } from "@clerk/astro/client";
import RightPanel from "@/components/react/RightPanel";
import useIsMobile from "@/hooks/useIsMobile";
import { useQueue } from "@/hooks/useQueue";

interface Props {
  initialGrid: any[];
  lastPixelPlaced: any;
}

export default function Panel({ initialGrid, lastPixelPlaced }: Props) {
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const isMobile = useIsMobile();
  const you = useSyncExternalStore(
    $userStore.listen,
    $userStore.get,
    $userStore.get
  );
  const { inQueue, position, connected, queued, reason, isReady } = useQueue(you?.id!);
  
  if (!you || !you.username || !isReady) {
    return; 
  }

  if (reason) {
    return (
      <div className="queue-message">
        <h2>Ya estás conectado</h2>
        <p>
          Detectamos que ya tienes otra pestaña abierta. Por favor, cierra la
          anterior antes de continuar.
        </p>
      </div>
    );
  }

  return (
    <>
      {inQueue ? (
        <div>
          <h1>Conectados: {connected}</h1>
          <h2>En cola: {queued}</h2>
          <p>Estás en cola. Posición: {position}</p>
        </div>
      ) : (
        <>
          {/* Main Content */}
          {isMobile && (
            <div className="flex flex-col md:h-[calc(100vh-49px)] h-[60vh] p-2">
              <RightPanel user={you} />
            </div>
          )}

          <div className="h-[50vh] md:h-[calc(100vh-49px)] flex-1 flex flex-col md:flex-row gap-2 p-2">
            {/*  Canvas */}
            <div className="flex-1 relative">
              <PixelCanvas
                activeColor={selectedColor}
                lastPixelPlaced={lastPixelPlaced}
                username={you?.username!}
                initialGrid={initialGrid}
              />
            </div>

            {/* Right Panel  */}
            {!isMobile && <RightPanel user={you} />}
          </div>

          <Footer
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />
        </>
      )}
    </>
  );
}
