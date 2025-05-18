import { useState, useSyncExternalStore, useEffect } from "react";
import Footer from "@/components/Footer";
import PixelCanvas from "@/components/react/PixelCanvas";
import { $userStore } from "@clerk/astro/client";
import RightPanel from "@/components/react/RightPanel";
import useIsMobile from "@/hooks/useIsMobile";
import { useQueue } from "@/hooks/useQueue";
import WaitingRoom from "./WaitingRoom";
import { getCurrentGrid, getLastPixelPlaced } from "@/services/api";

export default function Panel() {
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [initialGrid, setInitialGrid] = useState<any[]>([]);
  const [lastPixelPlaced, setLastPixelPlaced] = useState();
  const [loadingData, setLoadingData] = useState(true);
  const isMobile = useIsMobile();
  const you = useSyncExternalStore(
    $userStore.listen,
    $userStore.get,
    $userStore.get
  );
  const { inQueue, position, queued, reason, isReady, connectionFailed } =
    useQueue(you?.id!);

  useEffect(() => {
    if (connectionFailed && !reason) {
      window.location.href = "/";
    }
  }, [connectionFailed, reason]);

  useEffect(() => {
    const fetchData = async () => {
      if (!you?.username || !isReady || inQueue || reason) return;

      setLoadingData(true);
      const grid = await getCurrentGrid();
      const pixel = await getLastPixelPlaced();
      setInitialGrid(grid);
      setLastPixelPlaced(pixel);
      setLoadingData(false);
    };

    fetchData();
  }, [you?.username, isReady, inQueue, reason]);

  if (!you || !you.username || !isReady) {
    return;
  }

  if (loadingData && !inQueue && !reason) {
    return <WaitingRoom isLoading={true} />;
  }

  return (
    <>
      {inQueue || reason ? (
        <WaitingRoom queued={queued} position={position ?? 1} reason={reason} />
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
                initialGrid={initialGrid}
                lastPixelPlaced={lastPixelPlaced}
                activeColor={selectedColor}
                username={you?.username!}
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
