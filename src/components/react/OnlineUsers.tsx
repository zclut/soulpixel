import { Activity } from "lucide-react";
import { useStore } from "@nanostores/react";
import { onlineUsers } from "@/store";

export default function OnlineUsers() {
  const $onlineUsers = useStore(onlineUsers);

  return (
    <div className="flex items-center gap-1">
      <Activity className="h-3 w-3" />
      <span>ENTITIES: {$onlineUsers}</span>
    </div>
  );
}
