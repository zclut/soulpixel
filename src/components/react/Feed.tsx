import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  // Simular actividad de usuarios colocando píxeles
  useEffect(() => {
    const users = [
      "SOUL#1337",
      "CyberPunk42",
      "NeonHacker",
      "PixelWarrior",
      "GhostInTheShell",
      "MatrixBreaker",
    ];
    const colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
    ];

    const initialLogs: LogEntry[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 10),
      user: users[Math.floor(Math.random() * users.length)],
      action: "placed pixel",
      position: `(${Math.floor(Math.random() * 64)}, ${Math.floor(
        Math.random() * 64
      )})`,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setLogs(initialLogs);

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now(),
        timestamp: new Date(),
        user: users[Math.floor(Math.random() * users.length)],
        action: "placed pixel",
        position: `(${Math.floor(Math.random() * 64)}, ${Math.floor(
          Math.random() * 64
        )})`,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setLogs((prev) => [newLog, ...prev].slice(0, 100));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <ScrollArea className="h-full w-full" ref={scrollRef}>
      <div className="p-2 space-y-1 font-mono text-xs">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-1 group animate-fadeIn"
          >
            <span className="text-purple-700 shrink-0">
              [{log.timestamp.toLocaleTimeString()}]
            </span>
            <span className="text-fuchsia-500 shrink-0">{log.user}</span>
            <span className="text-purple-500 shrink-0">{log.action}</span>
            <span className="text-yellow-500 shrink-0">{log.position}</span>
            <div
              className="w-3 h-3 rounded-sm shrink-0 mt-0.5"
              style={{ backgroundColor: log.color }}
            />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-700 ml-auto">
              #{log.id.toString(16).padStart(8, "0")}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
