import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Leaderboard from "@/components/react/Leaderboard";
import Feed from "@/components/react/Feed";
import Profile from "@/components/react/Profile";
import { TerminalIcon } from "lucide-react";
import Achievement from "./Achievement";

interface Props {
  user: any;
}

const RightPanel = ({ user }: Props) => {
  return (
    <div className="w-full md:w-96 h-full flex flex-col gap-2">
      <Profile username={user.username} />

      <div className="border border-purple-900/50 bg-black/80 rounded-sm flex flex-col flex-1 overflow-hidden">
        <div className="p-2 border-b border-purple-900/50 flex justify-between items-center">
          <div className="text-sm tracking-wider flex items-center gap-2">
            <TerminalIcon className="h-4 w-4" />
            COMMUNICATION TERMINAL
          </div>
        </div>

        <Tabs defaultValue="feed" className="flex flex-col h-full">
          <TabsList className="bg-black border-b border-purple-900/50 rounded-none h-8 w-full shrink-0">
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

          <div className="flex-2 overflow-hidden mb-10">
            <TabsContent value="feed" className="h-full">
              <Feed username={user.username} />
            </TabsContent>
            <TabsContent value="leaderboard" className="h-full">
              <Leaderboard username={user.username} />
            </TabsContent>
            <TabsContent value="achievements" className="h-full">
              <Achievement username={user.username} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default RightPanel;
