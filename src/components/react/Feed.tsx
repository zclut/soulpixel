import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@nanostores/react";
import { feedList } from "@/store";

type LogEntry = {
  id: number;
  timestamp: Date;
  user: string;
  action: string;
  position: string;
  color: string;
};

export default function Feed() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const $feedList = useStore(feedList);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <ScrollArea className="h-full w-full" ref={scrollRef}>
      <div className="p-2 space-y-1 font-mono text-xs">
        {$feedList.map((feed) => (
          <div
            key={feed.created_at + feed.x + feed.y + feed.user}
            className="flex flex-wrap items-start gap-1 group animate-fadeIn"
          >
            <span className="text-fuchsia-500 shrink-0">{feed.user}</span>
            <span className="text-purple-500 shrink-0">{feed.message}</span>
            <span className="text-yellow-500 shrink-0">
              ({feed.x} {feed.y})
            </span>
            <div
              className="w-3 h-3 rounded-sm shrink-0 mt-0.5"
              style={{ backgroundColor: feed.color }}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
