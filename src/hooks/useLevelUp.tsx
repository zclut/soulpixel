import { getLevelFromPixels } from "@/lib/utils";
import { userPixelCounts } from "@/store";
import { $userStore } from "@clerk/astro/client";
import { useStore } from "@nanostores/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { Trophy } from 'lucide-react';

export default function useIsLevelUp() {
  const you = useSyncExternalStore(
    $userStore.listen,
    $userStore.get,
    $userStore.get
  );

  if (!you || !you.username) return

  const $userPixelCounts = useStore(userPixelCounts);
  const userCount = $userPixelCounts.get(you.username) || null;
  const prevLevelRef = useRef<any>(null);


  useEffect(() => {
    if (!userCount) return;
    const newLevel = getLevelFromPixels(userCount == null ? 0 : userCount);
    const prevLevel = prevLevelRef.current
    prevLevelRef.current = newLevel

    const levelUp = newLevel && prevLevel && newLevel.text !== prevLevel.text && newLevel.pixels > prevLevel.pixels;
    const levelDown = newLevel && prevLevel && newLevel.text !== prevLevel.text && newLevel.pixels < prevLevel.pixels;
    if (levelUp || levelDown) {
      const content = 
      <div>
        <strong>{levelUp ? 'Your soul has ascended to: ' : 'Your soul has dimmed into: '}</strong>
        <span className={`${newLevel.color}`}>{newLevel.text}</span>
      </div>
      
      const trophyColor = levelUp ? 'text-yellow-400' : 'text-amber-700';
      toast(content, {
        icon: <Trophy className={trophyColor} />,
      });
    }
  }, [userCount]);

  return;
}
