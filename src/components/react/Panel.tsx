import { useState, useSyncExternalStore } from "react";
import Footer from "@/components/Footer";
import PixelCanvas from "@/components/react/PixelCanvas";
import { $userStore } from "@clerk/astro/client";
import RightPanel from "@/components/react/RightPanel";
import useIsMobile from "@/hooks/useIsMobile";

interface Props {
  initialGrid: any[];
  initialLeaderboard: any[];
  lastPixelPlaced: any;
}

export default function Panel({
  initialGrid,
  initialLeaderboard,
  lastPixelPlaced,
}: Props) {
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const you = useSyncExternalStore(
    $userStore.listen,
    $userStore.get,
    $userStore.get
  );
  const isMobile = useIsMobile();

  return (
    <>
      {/* Main Content */}
      {isMobile && (
        <div className="flex flex-col md:h-[calc(100vh-49px)] h-[60vh] p-2">
          <RightPanel initialLeaderboard={initialLeaderboard} user={null} />
        </div>
      )}

      <div className="h-[50vh] md:h-[calc(100vh-49px)] flex-1 flex flex-col md:flex-row gap-2 p-2">
        {/*  Canvas */}
        <div className="flex-1 relative">
          <PixelCanvas
            activeColor={selectedColor}
            initialGrid={initialGrid}
            lastPixelPlaced={lastPixelPlaced}
            username={you?.username ?? ""}
          />
        </div>

        {/* Right Panel  */}
        {!isMobile && (
          <RightPanel initialLeaderboard={initialLeaderboard} user={null} />
        )}
      </div>

      <Footer selectedColor={selectedColor} onColorChange={setSelectedColor} />
    </>
  );
}
