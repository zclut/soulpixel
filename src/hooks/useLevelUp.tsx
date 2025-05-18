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

    if (newLevel && prevLevel && prevLevel.text !== newLevel.text && userCount > 0) { 
      toast(`🎉 Nivel alcanzado: ${newLevel?.text}`, {
        icon: <Trophy className="text-yellow-400" />,
        className: `!bg-gray-900/50 ${`!${newLevel?.color}`}`,
      });
    }
  }, [userCount]);

  return;
}
