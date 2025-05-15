import { atom } from 'nanostores';

type Feed = {
    x: number;
    y: number;
    color: string;
    user: string;
    created_at: string;
}

export const feed = atom<Feed | null>(null);