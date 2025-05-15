import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TerminalIcon } from "lucide-react";
import { useState } from "react";
import Feed from "@/components/react/Feed";
import Footer from "@/components/Footer";
import Leaderboard from "@/components/react/Leaderboard";
import PixelCanvas from "@/components/react/PixelCanvas";

interface Props {
  initialGrid: any[];
  initialLeaderboard: any[];
}

export default function Panel({ initialGrid, initialLeaderboard }: Props) {
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 p-2">
        {/*  Left Panel - Canvas */}
        <div className="flex-1 relative">
          <PixelCanvas activeColor={selectedColor} initialGrid={initialGrid} />
        </div>

        {/* Right Panel - Chat */}
        <div className="w-full md:w-96 flex flex-col gap-2">
          {/* Terminal Feed */}
          <div className="border border-purple-900/50 bg-black/80 rounded-sm overflow-hidden flex flex-col">
            <div className="p-2 border-b border-purple-900/50 flex justify-between items-center">
              <div className="text-sm tracking-wider flex items-center gap-2">
                <TerminalIcon className="h-4 w-4" />
                COMMUNICATION TERMINAL
              </div>
            </div>
            <Tabs defaultValue="feed" className="flex-1 flex flex-col">
              <TabsList className="bg-black border-b border-purple-900/50 rounded-none h-8 w-full">
                <TabsTrigger
                  value="feed"
                  className="text-xs h-6 data-[state=active]:bg-purple-900/20"
                >
                  FEED
                </TabsTrigger>
                <TabsTrigger
                  value="leaderboard"
                  className="text-xs h-6 data-[state=active]:bg-purple-900/20"
                >
                  LEADERBOARD
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="text-xs h-6 data-[state=active]:bg-purple-900/20"
                >
                  ACHIEVEMENTS
                </TabsTrigger>
              </TabsList>
              <TabsContent value="feed" className="flex-1 p-0 m-0">
                <Feed />
              </TabsContent>
              <TabsContent value="leaderboard" className="flex-1 p-0 m-0">
                <Leaderboard initialLeaderboard={initialLeaderboard}/>
              </TabsContent>
              <TabsContent value="achievements" className="flex-1 p-0 m-0">
                {/* <Achievements /> */}
                Achievements
              </TabsContent>
            </Tabs>
          </div>

          {/* System */}
        </div>
      </div>

      <Footer selectedColor={selectedColor} onColorChange={setSelectedColor} />
    </>
  );
}
