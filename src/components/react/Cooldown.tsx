import { getFormattedTime } from "@/lib/utils";
import { useEffect } from "react";

interface Props {
  cooldown: number;
  setCooldown: React.Dispatch<React.SetStateAction<number>>;
  cooldownDuration: number;
}

const Cooldown = ({ cooldown, setCooldown, cooldownDuration }: Props) => {
  const progress = 100 - (cooldown / cooldownDuration) * 100;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="absolute bottom-2 right-2 flex flex-col gap-2 items-end">
      <div className="relative w-28 h-8 rounded-sm overflow-hidden border border-purple-900/50 bg-purple-900/20 text-white font-mono text-sm flex items-center justify-center">
        {/* Progress bar */}
        <div
          className="absolute left-0 top-0 h-full bg-purple-700/40 transition-all duration-200"
          style={{ width: `${progress}%` }}
        ></div>

        {/* Text (foreground) */}
        <span className="relative z-10">
          {cooldown > 0 ? `Place in ${getFormattedTime(cooldown)}` : "Place"}
        </span>
      </div>
    </div>
  );
};

export default Cooldown;
