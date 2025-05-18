/**
interface Props {
  username: string;
}

export default function Achievement({ username }: Props) {
  const $userPixelCounts = useStore(userPixelCounts);
  const userCount = $userPixelCounts.get(username) || 0;

  const userAchievements = getAchievementsUpToPixels(userCount);

  return (
    <div
      className="achievement-list p-4 text-white rounded-md space-y-4 max-h-96 overflow-y-auto"
      style={{ maxHeight: "24rem" }} // max height ~384px
    >
      {userAchievements.length > 0 ? (
        userAchievements.map((achv) => (
          <div
            key={achv.rank}
            className="achievement-item border border-purple-600 p-3 rounded-md"
          >
            <h3 className="text-lg font-semibold">
              {achv.emoji} {achv.rank}
            </h3>
            <p>{achv.description}</p>
            <p className="mt-1 text-sm text-gray-400">
              From {achv.minPixels}
              {achv.maxPixels ? ` to ${achv.maxPixels}` : "+"} souls
            </p>
          </div>
        ))
      ) : (
        <p>Place some pixels to start your journey...</p>
      )}
    </div>
  );
}

*/

("use client");

import { useStore } from "@nanostores/react";
import { userStats } from "@/store";
import { getAchievementsUpToPixels } from "@/utils/achievements.utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Lock, Unlock } from "lucide-react";
import { Badge } from "../ui/badge";

interface Props {
  username: string;
}

export default function Achievements({ username }: Props) {
  const $userColorCount = userStats(username);
  const { totalSouls, uniqueColors, rank } = useStore($userColorCount);

  const userAchievements = getAchievementsUpToPixels(
    totalSouls,
    uniqueColors,
    rank
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-purple-900/20 text-purple-500 border-purple-900/50";
      case "uncommon":
        return "bg-blue-900/20 text-blue-500 border-blue-900/50";
      case "rare":
        return "bg-fuchsia-900/20 text-fuchsia-500 border-fuchsia-900/50";
      case "epic":
        return "bg-pink-900/20 text-pink-500 border-pink-900/50";
      case "legendary":
        return "bg-yellow-900/20 text-yellow-500 border-yellow-900/50";
      default:
        return "bg-purple-900/20 text-purple-500 border-purple-900/50";
    }
  };

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-2 space-y-3 font-mono text-xs">
        {userAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`border rounded-sm p-2 ${
              achievement.unlocked
                ? getRarityColor(achievement.rarity)
                : "border-purple-900/30 bg-black/50 text-purple-700"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`p-1 rounded-sm ${
                  achievement.unlocked
                    ? getRarityColor(achievement.rarity)
                    : "bg-purple-900/10"
                }`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={achievement.unlocked ? "" : "text-purple-700"}
                  >
                    {achievement.name}
                  </span>
                  {achievement.unlocked ? (
                    <Unlock className="h-3 w-3 text-purple-500" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                </div>
                <div className="text-[10px] text-purple-700 mt-0.5">
                  {achievement.description}
                </div>
              </div>
              <Badge
                className={`uppercase ${getRarityColor(achievement.rarity)}`}
                variant="outline"
              >
                {achievement.rarity}
              </Badge>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-[10px] mb-1">
                <span>Progress</span>
                <span>
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
              <Progress
                value={(achievement.progress / achievement.maxProgress) * 100}
                className={`h-1 ${
                  achievement.unlocked ? "bg-black/50" : "bg-purple-900/20"
                }`}
                indicatorClassName={
                  achievement.unlocked
                    ? `${
                        achievement.rarity === "legendary"
                          ? "bg-gradient-to-r from-yellow-500 to-red-500"
                          : ""
                      }`
                    : "bg-purple-700"
                }
              />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
