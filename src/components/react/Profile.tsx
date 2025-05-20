import { SignedIn, UserButton } from "@clerk/astro/react";
import { Copyright, Info } from "lucide-react";
import OnlineUsers from "@/components/react/OnlineUsers";
import { userPixelCounts, userStats } from "@/store";
import { useStore } from "@nanostores/react";
import { getFormattedTime, getLevelFromPixels } from "@/lib/utils";
import { getAchievementsUpToPixels } from "@/utils/achievements.utils";
import useIsLevelUp from "@/hooks/useLevelUp";
import useIsAchievements from "@/hooks/useIsAchievements";
import TimelapseDialog from "@/components/react/TimelapseDialog";
import RankInfo from "./RankInfo";

interface Props {
  username: string;
  cooldown: number;
}

const Profile = ({ username, cooldown }: Props) => {
  const $userPixelCounts = useStore(userPixelCounts);
  const $userStats = userStats(username);
  const userCount = $userPixelCounts.get(username) || 0;
  const level = getLevelFromPixels(userCount);
  const { totalSouls, uniqueColors, rank } = useStore($userStats);
  useIsLevelUp();
  useIsAchievements();

  const userAchievements = getAchievementsUpToPixels(
    totalSouls,
    uniqueColors,
    rank
  ).filter((achievement) => achievement.unlocked).length;

  const profile = [
    { id: 1, name: "ENTITY", value: username },
    { id: 2, name: "RANK", value: level?.text.toUpperCase() },
    { id: 3, name: "FRAGMENTS", value: userCount },
    { id: 4, name: "ACHIEVEMENTS", value: userAchievements },
  ];

  const PROFILE_STYLES = {
    ENTITY: { color: "text-fuchsia-500" },
    RANK: { color: level?.color },
    FRAGMENTS: { color: "text-fuchsia-500" },
    ACHIEVEMENTS: { color: "text-yellow-500" },
  };

  return (
    <div className="border border-purple-900/50 bg-black/80 rounded-sm overflow-hidden">
      <div className="p-2 border-b border-purple-900/50 flex justify-between items-center">
        <div className="text-sm tracking-wider flex items-center gap-2">
          <Info className="h-4 w-4" />
          PROFILE
        </div>
        <div>
          <TimelapseDialog />
        </div>
      </div>
      <div className="p-2">
        <div className="flex flex-row gap-2 mb-2">
          <div className="flex flex-col items-center justify-center mb-2">
            <SignedIn>
              <div className="w-[4rem] h-[4rem] rounded-full overflow-hidden">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        width: "4rem",
                        height: "4rem",
                        border: "3px solid #8B5BE8",
                      },
                    },
                  }}
                />
              </div>
            </SignedIn>
            {/* <span className="text-lg font-bold text-center">{user.username}</span> */}
          </div>
          <div className="flex flex-wrap justify-between text-sm w-full">
            {profile.map(({ id, name, value }) => (
              <div
                key={id}
                className={`flex w-1/2 items-center gap-1 align-middle`}
              >
                <span className="text-purple-500 font-semibold">{name}:</span>
                <span
                  className={`${
                    PROFILE_STYLES[name as keyof typeof PROFILE_STYLES].color
                  } truncate font-mono text-xs`}
                >
                  <div className="flex items-center gap-2">
                    {value}
                    { id == 2 && <RankInfo /> }
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center align-middle text-xs gap-2">
          <span className="inline-flex items-center gap-1 my-auto">
            <Copyright size={12} />
            <span>SOULPIXEL</span>
          </span>
          <div className="flex items-center justify-center text-[0.8rem] px-4 text-yellow-500">
            {cooldown > 0 ? getFormattedTime(cooldown) : "Place it!"}
          </div>
          <OnlineUsers />
        </div>
      </div>
    </div>
  );
};

export default Profile;
