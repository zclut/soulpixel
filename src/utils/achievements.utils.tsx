import { COLORS } from "@/lib/const";
import {
  Award,
  Target,
  Grid,
  Clock,
  Users,
  Palette,
  Shield,
} from "lucide-react";

type Achievement = {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  type?: TypeProgress;
};

enum TypeProgress {
  SOUL = "SOUL",
  COLOR = "COLOR",
  RANK = "RANK",
}

const achievements: Achievement[] = [
  {
    id: 1,
    name: "GHOST TRACE",
    description: "Manifest your first Soul. The echo begins.",
    icon: <Target className="h-5 w-5" />,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    rarity: "common",
    type: TypeProgress.SOUL,
  },
  {
    id: 2,
    name: "GRIDLING",
    description: "Release 100 Souls into existence. Your signal gains clarity.",
    icon: <Grid className="h-5 w-5" />,
    progress: 0,
    maxProgress: 100,
    unlocked: false,
    rarity: "common",
    type: TypeProgress.SOUL,
  },
  {
    id: 3,
    name: "SOUL LINKED",
    description: "500 is the magic number. Your Soul resonates with the grid.",
    icon: <Clock className="h-5 w-5" />,
    progress: 0,
    maxProgress: 500,
    unlocked: false,
    rarity: "uncommon",
    type: TypeProgress.SOUL,
  },
  {
    id: 4,
    name: "CHROMA SEEKER",
    description:
      "Channel every color at least once. Walk the full Soul spectrum.",
    icon: <Palette className="h-5 w-5" />,
    progress: 8,
    maxProgress: COLORS.length,
    unlocked: false,
    rarity: "uncommon",
    type: TypeProgress.COLOR,
  },
  {
    id: 5,
    name: "SOUL WARD",
    description: "Embrace the soul. 2000 souls are your shield.",
    icon: <Shield className="h-5 w-5" />,
    progress: 0,
    maxProgress: 2000,
    unlocked: false,
    rarity: "rare",
    type: TypeProgress.SOUL,
  },
  {
    id: 6,
    name: "NEON VOICE",
    description: "Reach the top 3. Your Soul resonates across dimensions.",
    icon: <Users className="h-5 w-5" />,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    rarity: "epic",
    type: TypeProgress.RANK,
  },
  {
    id: 7,
    name: "SOUL ARCHITECT",
    description: "Manifest 10,000 Souls. You shape the digital beyond.",
    icon: <Award className="h-5 w-5" />,
    progress: 0,
    maxProgress: 10000,
    unlocked: false,
    rarity: "legendary",
    type: TypeProgress.SOUL,
  },
];

export function getAchievementsUpToPixels(
  pixelsPlaced: number,
  colorCount: number,
  rank: number
): Achievement[] {
  return achievements
    .map((achievement) => {
      let progress = 0;
      switch (achievement.type) {
        case TypeProgress.SOUL:
          progress = pixelsPlaced;
          break;
        case TypeProgress.COLOR:
          progress = colorCount;
          break;
        case TypeProgress.RANK:
          progress = rank <= 3 ? 1 : 0;
          break;
        default:
          progress = 0;
          break;
      }
      return {
        ...achievement,
        progress:
          progress >= achievement.maxProgress
            ? achievement.maxProgress
            : progress,
        unlocked: progress >= achievement.maxProgress,
      };
    })
    .sort((a, b) => Number(a.unlocked) - Number(b.unlocked));
}
