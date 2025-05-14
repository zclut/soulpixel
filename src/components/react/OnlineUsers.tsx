import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Activity } from "lucide-react";

export default function OnlineUsers() {
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const channel = supabase.channel("online-users", {
      config: {
        presence: {
          key: `user-${Math.random().toString(36).slice(2)}`, // o usa auth.user.id si estás autenticado
        },
      },
    });

    // Track this user as "online"
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({});
      }
    });

    // Escucha actualizaciones de presence
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const total = Object.keys(state).length;
      setOnlineCount(total);
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="flex items-center gap-1">
      <Activity className="h-5 w-5"/> 
      <span>CONNECTED SOULS: {onlineCount}</span>
    </div>
  );
}
