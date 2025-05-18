import { atom, computed } from "nanostores";

export type PixelData = {
  x: number;
  y: number;
  color: string;
  user_id: string;
  created_at: string;
};

export type PixelInfo = {
  x?: number;
  y?: number;
  color: string;
  user: string;
  created_at: string;
};

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
  data.forEach(({ x, y, user_id, ...pixel }) => {
    const key = `${x},${y}`;
    newGrid.set(key, {
      ...pixel,
      user: user_id,
    });
  });
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
export const userPixelCounts = computed(grid, ($grid) =>
  Array.from($grid.values()).reduce(
    (acc, { user }) => acc.set(user, (acc.get(user) || 0) + 1),
    new Map<string, number>()
  )
);

export const userStats = (userId: string) =>
  computed(grid, ($grid) => {
    const userSoulsMap = new Map<string, number>();

    // Paso 1: contar total de souls por usuario
    for (const { user } of $grid.values()) {
      userSoulsMap.set(user, (userSoulsMap.get(user) || 0) + 1);
    }

    // Paso 2: calcular el total de souls del usuario actual
    const totalSouls = userSoulsMap.get(userId) || 0;

    // Paso 3: calcular cuántos usuarios tienen más souls que él (para rank)
    const rank =
      1 +
      Array.from(userSoulsMap.values()).filter((souls) => souls > totalSouls).length;

    // Paso 4: contar colores únicos del usuario
    const colorCountMap = new Map<string, number>();
    for (const { user, color } of $grid.values()) {
      if (user === userId) {
        colorCountMap.set(color, (colorCountMap.get(color) || 0) + 1);
      }
    }

    const uniqueColors = colorCountMap.size;

    return { uniqueColors, totalSouls, rank, colorsUsed: colorCountMap };
  });

