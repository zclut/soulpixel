import { useStore } from "@nanostores/react";
import { userStats } from "@/store";
import { getAchievementsUpToPixels } from "@/utils/achievements.utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Lock, Unlock } from "lucide-react";
import { Badge } from "../ui/badge";
import { getRarityColor } from "@/lib/const";

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

  return (
    <ScrollArea className="h-full w-full">
      <div className="px-2 py-1 space-y-3 font-mono text-xs">
        {userAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`border rounded-sm font-semibold font-mono p-2 ${getRarityColor(
              achievement.rarity
            )}`}
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
                  <span> {achievement.name} </span>
                  {achievement.unlocked ? (
                    <Unlock className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                </div>
                <div className="text-[10px] opacity-80 font-light mt-0.5">
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
                className={`h-1 ${getRarityColor(achievement.rarity)}`}
                indicatorClassName={`${getRarityColor(achievement.rarity, {
                  progress: true,
                  border: false,
                  text: false,
                  background: false,
                })}`}
              />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
