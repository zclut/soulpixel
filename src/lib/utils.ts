import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { LEVEL } from "./const"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getLevelFromPixels = (pixels: number) => {
  const levels = Object.values(LEVEL);
  const sortedLevels = levels.sort((a, b) => b.pixels - a.pixels);
  return sortedLevels.find(level => pixels >= level.pixels);
};