import { useState, useEffect, useSyncExternalStore } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy } from "lucide-react";
import { getLevelFromPixels } from "@/lib/utils";
import { $userStore } from "@clerk/astro/client";

type LeaderboardEntry = {
  id: number;
  rank: number;
  user_id: string;
  total: number;
  level: any;
  isYou: boolean;
};

interface Props {
  initialLeaderboard: any[];
}

export default function Leaderboard({ initialLeaderboard }: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const u = useSyncExternalStore(
    $userStore.listen,
    $userStore.get,
    $userStore.get
  );

//   const handleLeaderBoardChanges = (newPixel: any) => {
//     setLeaderboard((prev) => {
//       const newLeaderboard = [...prev];
//       const user = newLeaderboard.find((user) => user.user_id === u?.username);
//       if (user) {
//         user.total += 1;
//       }
//       return newLeaderboard;
//     });
//   };

//   listenToGridChanges(handleLeaderBoardChanges)

  useEffect(() => {
    const rankedUsers = initialLeaderboard.map((user, index) => ({
      ...user,
      level: getLevelFromPixels(user.total),
      rank: index + 1,
      isYou: user.user_id === u?.username,
    }));

    setLeaderboard(rankedUsers);
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-400" />;
    if (rank === 2) return <Trophy className="h-4 w-4 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-4 w-4 text-amber-700" />;
    return <span className="text-green-700">#{rank}</span>;
  };

  return (
    <ScrollArea className="h-[300px] w-full">
      <div className="p-2 space-y-1 font-mono text-xs">
        <div className="grid grid-cols-12 gap-2 text-purple-700 border-b border-purple-900/50 pb-1 mb-2">
          <div className="col-span-1">#</div>
          <div className="col-span-5">USER</div>
          <div className="col-span-3 text-right">PIXELS</div>
          <div className="col-span-3 text-right">LEVEL</div>
        </div>

        {leaderboard.map((entry) => (
          <div
            key={entry.rank}
            className={`grid grid-cols-12 gap-2 py-1 px-1 rounded-sm ${
              entry.isYou
                ? "bg-purple-900/20 border border-purple-900/50"
                : "hover:bg-purple-900/10"
            }`}
          >
            <div className="col-span-1 flex items-center">
              {getRankIcon(entry.rank)}
            </div>
            <div className="col-span-5 flex items-center truncate">
              {entry.isYou ? (
                <span className="text-yellow-500">
                  {entry.user_id} <span className="text-purple-700">(you)</span>
                </span>
              ) : (
                <span>{entry.user_id}</span>
              )}
            </div>
            <div className="col-span-3 text-right">
              {entry.total.toLocaleString()}
            </div>
            <div className={`col-span-3 text-right ${entry.level.color}`}>
              {entry.level.text}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
