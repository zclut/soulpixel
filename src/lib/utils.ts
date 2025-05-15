import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { COOLDOWN_DURATION, LEVEL } from "./const"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getLevelFromPixels = (pixels: number) => {
  const levels = Object.values(LEVEL);
  const sortedLevels = levels.sort((a, b) => b.pixels - a.pixels);
  return sortedLevels.find(level => pixels >= level.pixels);
};

export const getFormattedTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export const getCooldownRemaining = (isoDate: string, cooldownSeconds = COOLDOWN_DURATION) => { 
  if (!isoDate) {
    return 0
  }

  const lastPixelTime = new Date(isoDate).getTime() 
  const now = Date.now()
  const elapsed = (now - lastPixelTime) / 1000
  return Math.max(0, Math.ceil(cooldownSeconds - elapsed))
}