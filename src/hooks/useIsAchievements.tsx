import { getRarityColor } from "@/lib/const";
import { userStats } from "@/store";
import { getAchievementsUpToPixels } from "@/utils/achievements.utils";
import { $userStore } from "@clerk/astro/client";
import { useStore } from "@nanostores/react";
import {
  useEffect,
  useRef,
  useSyncExternalStore
} from "react";
import { toast } from "sonner";

export default function useIsLevelUp() {
  const you = useSyncExternalStore(
    $userStore.listen,
    $userStore.get,
    $userStore.get
  );

  if (!you || !you.username) return;
  const showToast = (title: string, achievement: any, icon: any) => {
    const color = getRarityColor(achievement.rarity, {
      background: false,
      border: false,
      text: true,
    });
    toast(
      <div className="font-mono">
        <strong>{title}</strong>
        <span className={color}>{achievement.name}</span>
        <div className="text-xs text-muted-foreground">
          {achievement.description}
        </div>
      </div>,
      {
        icon,
        classNames: {
            icon: color
        }
      }
    );
  };

  const $userStats = userStats(you.username);
  const { totalSouls, uniqueColors, rank } = useStore($userStats);
  const userAchievements = getAchievementsUpToPixels(
    totalSouls,
    uniqueColors,
    rank
  ).filter((achievement) => achievement.unlocked);
  const userAchievementsLength = userAchievements.length;
  const prevAchievementsRef = useRef<any[]>(userAchievements);
  const initializedRef = useRef(false);



  useEffect(() => {
    if (!userAchievements || totalSouls === 0) return;

    const prevAchievements = !initializedRef.current
      ? [...userAchievements]
      : prevAchievementsRef.current;
    prevAchievementsRef.current = [...userAchievements];

    if (!initializedRef.current) initializedRef.current = true;

    const prevMap = new Map(prevAchievements.map((a) => [a.id, a]));
    const newMap = new Map(userAchievements.map((a) => [a.id, a]));

    newMap.forEach((newAch, id) => {
      if (!prevMap.has(id)) {
        showToast("Achievement Acquired: ", newAch, newAch.icon);
      }
    });

    prevMap.forEach((prevAch, id) => {
      if (!newMap.has(id)) {
        showToast("Achievement Lost: ", prevAch, prevAch.icon);
      }
    });
  }, [userAchievementsLength, totalSouls]);

  return;
}
