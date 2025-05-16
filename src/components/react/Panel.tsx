import { useState, useSyncExternalStore, useEffect } from "react";
import Footer from "@/components/Footer";
import PixelCanvas from "@/components/react/PixelCanvas";
import { $userStore } from "@clerk/astro/client";
import RightPanel from "@/components/react/RightPanel";
import useIsMobile from "@/hooks/useIsMobile";
import { useQueue } from "@/hooks/useQueue";
import WaitingRoom from "./WaitingRoom";

export default function Panel() {
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const isMobile = useIsMobile();
  const you = useSyncExternalStore(
    $userStore.listen,
    $userStore.get,
    $userStore.get
  );
  const { inQueue, position, queued, reason, isReady, connectionFailed } =
    useQueue(you?.id!);

  useEffect(() => {
    if (connectionFailed) {
      window.location.href = "/";
    }
  }, [connectionFailed]);

  if (!you || !you.username || !isReady) {
    return;
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
