import { atom } from "nanostores";

export type Pixel = {
    x: number;
    y: number;
    color: string;
    user: string;
    created_at: string;
    message?: string;
  };

export const feedList = atom<Pixel[]>([]);
