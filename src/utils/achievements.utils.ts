
type Achievement = {
  rank: string;
  minPixels: number;
  maxPixels?: number;
  description: string;
  emoji: string;
};

const achievements: Achievement[] = [
  {
    emoji: "🕶️",
    rank: "Ghost Data",
    minPixels: 1,
    maxPixels: 9,
    description: "A whisper in the void. Just spawned into the grid.",
  },
  {
    emoji: "🧬",
    rank: "Low Bit Soul",
    minPixels: 10,
    maxPixels: 49,
    description:
      "Your presence flickers like an old CRT. You're learning to echo.",
  },
  {
    emoji: "🛠",
    rank: "Synth Wraith",
    minPixels: 50,
    maxPixels: 199,
    description: "You’ve begun bending light and code to your will.",
  },
  {
    emoji: "💡",
    rank: "Neon Seeker",
    minPixels: 200,
    maxPixels: 499,
    description: "Guided by color and instinct, shaping fragments of the grid.",
  },
  {
    emoji: "🧠",
    rank: "Circuit Monk",
    minPixels: 500,
    maxPixels: 999,
    description:
      "Balance between soul and signal. You bring rhythm to the canvas.",
  },
  {
    emoji: "🌐",
    rank: "Ghost Engineer",
    minPixels: 1000,
    maxPixels: 1999,
    description: "Architect of flow. Your presence alters the matrix.",
  },
  {
    emoji: "⚡",
    rank: "Soulcaster",
    minPixels: 2000,
    maxPixels: 4999,
    description: "A force of will and pixels, pulsing through the neon dust.",
  },
  {
    emoji: "🌌",
    rank: "The Glitched One",
    minPixels: 5000,
    description:
      "Transcended mortal pixels. You are both bug and god in the system.",
  },
];

export function getAchievementsUpToPixels(pixelsPlaced: number): Achievement[] {
  return achievements
    .filter((achievement) => pixelsPlaced >= achievement.minPixels)
    .sort((a, b) => b.minPixels - a.minPixels);
}