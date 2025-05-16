import { useStore } from "@nanostores/react";
import { userPixelCounts } from "@/store";
import { getAchievementsUpToPixels } from "@/utils/achievements.utils";

interface Props {
  username: string;
}

export default function Achievement({ username }: Props) {
  const $userPixelCounts = useStore(userPixelCounts);
  const userCount = $userPixelCounts.get(username) || 0;

  const userAchievements = getAchievementsUpToPixels(userCount);

  return (
    <div
      className="achievement-list p-4 text-white rounded-md space-y-4 max-h-96 overflow-y-auto"
      style={{ maxHeight: "24rem" }} // max height ~384px
    >
      {userAchievements.length > 0 ? (
        userAchievements.map((achv) => (
          <div
            key={achv.rank}
            className="achievement-item border border-purple-600 p-3 rounded-md"
          >
            <h3 className="text-lg font-semibold">
              {achv.emoji} {achv.rank}
            </h3>
            <p>{achv.description}</p>
            <p className="mt-1 text-sm text-gray-400">
              From {achv.minPixels}
              {achv.maxPixels ? ` to ${achv.maxPixels}` : "+"} souls
            </p>
          </div>
        ))
      ) : (
        <p>Place some pixels to start your journey...</p>
      )}
    </div>
  );
}
