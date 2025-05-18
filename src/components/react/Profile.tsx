import { SignedIn, UserButton } from "@clerk/astro/react";
import { Copyright, Info } from "lucide-react";
import OnlineUsers from "@/components/react/OnlineUsers";
import { userPixelCounts, userStats } from "@/store";
import { useStore } from "@nanostores/react";
import { getFormattedTime, getLevelFromPixels } from "@/lib/utils";
import { getAchievementsUpToPixels } from "@/utils/achievements.utils";

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

  const userAchievements = getAchievementsUpToPixels(
    totalSouls,
    uniqueColors,
    rank
  ).filter((achievement) => achievement.unlocked).length;

  const profile = [
    { id: 1, name: "TAG", value: username },
    { id: 2, name: "RANK", value: level?.text.toUpperCase() },
    { id: 3, name: "SOULS", value: userCount },
    { id: 4, name: "ACHIEVEMENTS", value: userAchievements },
    { id: 5, name: "COOLDOWN", value: cooldown > 0 ? getFormattedTime(cooldown) : "Place it!" },
  ];

  const PROFILE_STYLES = {
    TAG: { color: "text-fuchsia-500" },
    RANK: { color: level?.color },
    SOULS: { color: "text-fuchsia-500" },
    ACHIEVEMENTS: { color: "text-yellow-500" },
    COOLDOWN: { color: "text-fuchsia-500" },
  }

  return (
    <div className="border border-purple-900/50 bg-black/80 rounded-sm overflow-hidden">
      <div className="p-2 border-b border-purple-900/50 flex justify-between items-center">
        <div className="text-sm tracking-wider flex items-center gap-2">
          <Info className="h-4 w-4" />
          PROFILE
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
              <div key={id} className={`flex w-1/2 items-center gap-1 align-middle`}>
                <span className="text-purple-500 font-semibold">{name}:</span>
                <span className={`${PROFILE_STYLES[name as keyof typeof PROFILE_STYLES].color} truncate font-mono text-xs`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="inline-flex items-center gap-1 my-auto">
            <Copyright size={12} />
            <span>SOULPIXEL</span>
          </span>
          <OnlineUsers />
        </div>
      </div>
    </div>
  );
};

export default Profile;
