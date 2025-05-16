import { atom, computed } from "nanostores";

export type PixelData = {
  x: number;
  y: number;
  color: string;
  user_id: string;
  created_at: string;
}

export type PixelInfo = {
  x?: number;
  y?: number;
  color: string;
  user: string;
  created_at: string;
}

export type Pixel = {
  x: number;
  y: number;
  color: string;
  user: string;
  created_at: string;
  message?: string;
  uuid?: string;
};

// Users
export const onlineUsers = atom<number>(0);
export const setOnlineUsers = (count: number) => onlineUsers.set(count);

// Feed
export const feedList = atom<Pixel[]>([]);

// Grid
export const grid = atom<Map<string, PixelInfo>>(new Map());
export const setInitialGrid = (data: PixelData[]) => {
  const newGrid = new Map<string, PixelInfo>();
  data.forEach(({x, y, user_id, ...pixel}) => {
    const key = `${x},${y}`;
    newGrid.set(key, {
      ...pixel,
      user: user_id,
    });
  }
  );
  grid.set(newGrid);
};

export const addPixelToGrid = (data: PixelInfo) => {
  const { x, y, color, user, created_at } = data;
  const key = `${x},${y}`;
  const value = { color, user, created_at };

  const newGrid = new Map(grid.get());
  newGrid.set(key, value);
  grid.set(newGrid);
};

// Leaderboard
export const userPixelCounts = computed(grid, $grid =>
  Array.from($grid.values()).reduce(
    (acc, { user }) => acc.set(user, (acc.get(user) || 0) + 1),
    new Map<string, number>()
  )
)
