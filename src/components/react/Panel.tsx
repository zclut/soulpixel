import { useState, useSyncExternalStore, useEffect } from "react";
import Footer from "@/components/Footer";
import PixelCanvas from "@/components/react/PixelCanvas";
import { $userStore } from "@clerk/astro/client";
import RightPanel from "@/components/react/RightPanel";
import useIsMobile from "@/hooks/useIsMobile";
import { useQueue } from "@/hooks/useQueue";
import WaitingRoom from "./WaitingRoom";
import { getCurrentGrid, getLastPixelPlaced } from "@/services/api";
import useIsAdmin from "@/hooks/userIsAdmin";
import { getCooldownRemaining } from "@/lib/utils";

export default function Panel() {
  const you = useSyncExternalStore(
    $userStore.listen,
    $userStore.get,
    $userStore.get
  );
  const [cooldown, setCooldown] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [initialGrid, setInitialGrid] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const isMobile = useIsMobile();
  const { inQueue, position, queued, reason, isReady, connectionFailed } = useQueue(you?.id!);
  const isAdmin = useIsAdmin();

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
      const lastPixelPlaced = pixel.length > 0 ? pixel[0] : null;
      setInitialGrid(grid);
      setCooldown(isAdmin ? 0 : getCooldownRemaining(lastPixelPlaced?.created_at ?? null));
      setLoadingData(false);
    };

    fetchData();
  }, [you?.username, isReady, inQueue, reason]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

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
              <RightPanel user={you} cooldown={cooldown} />
            </div>
          )}

          <div className="h-[50vh] md:h-[calc(100vh-49px)] flex-1 flex flex-col md:flex-row gap-2 p-2">
            {/*  Canvas */}
            <div className="flex-1 relative">
              <PixelCanvas
                initialGrid={initialGrid}
                cooldown={cooldown}
                setCooldown={setCooldown}
                activeColor={selectedColor}
                username={you?.username!}
              />
            </div>

            {/* Right Panel  */}
            {!isMobile && <RightPanel user={you} cooldown={cooldown} />}
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
