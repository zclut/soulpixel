import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy } from "lucide-react";
import { getLevelFromPixels } from "@/lib/utils";
import { userPixelCounts } from "@/store";
import { useStore } from "@nanostores/react";

type LeaderboardEntry = {
  id: number;
  rank: number;
  user_id: string;
  total: number;
  level: any;
  isYou: boolean;
};

interface Props {
  username: string;
}

export default function Leaderboard({ username }: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const $userPixelCounts = useStore(userPixelCounts);

  useEffect(() => {
    const rankedUsers = Array.from($userPixelCounts.entries())
    .sort(([_, a], [__, b]) => b - a)
    .map(([key, value], index) => ({
      id: index,
      level: getLevelFromPixels(value),
      rank: index + 1,
      total: value,
      user_id: key,
      isYou: key === username,
    }));

    setLeaderboard(rankedUsers);
  }, [$userPixelCounts]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-400" />;
    if (rank === 2) return <Trophy className="h-4 w-4 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-4 w-4 text-amber-700" />;
    return <span className="text-green-700">#{rank}</span>;
  };

  return (
    <ScrollArea className="h-full w-full">
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
