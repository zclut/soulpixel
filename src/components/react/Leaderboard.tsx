import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trophy } from "lucide-react"
import { getLeaderboard } from "@/lib/supabase"

type LeaderboardEntry = {
  id: number
  rank: number
  username: string
  pixels: number
  level: string
  isYou: boolean
}

interface Props {
    initialLeaderboard: any[];
}

export default function Leaderboard({ initialLeaderboard }: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])


  // Simular datos de leaderboard
  useEffect(() => {
    const users = [
      { id: 1, username: "SOUL#1337", pixels: 4231, level: "MASTER", isYou: false },
      { id: 2, username: "CyberPunk42", pixels: 3982, level: "ELITE", isYou: false },
      { id: 3, username: "NeonHacker", pixels: 3654, level: "ELITE", isYou: false },
      { id: 4, username: "PixelWarrior", pixels: 3201, level: "ADEPT", isYou: false },
      { id: 5, username: "GhostInTheShell", pixels: 2876, level: "ADEPT", isYou: false },
      { id: 6, username: "MatrixBreaker", pixels: 2543, level: "ADEPT", isYou: false },
      { id: 7, username: "DigitalNomad", pixels: 2187, level: "SKILLED", isYou: false },
      { id: 8, username: "VirtualPhantom", pixels: 1954, level: "SKILLED", isYou: false },
      { id: 9, username: "CodeRunner", pixels: 1732, level: "SKILLED", isYou: false },
      { id: 10, username: "SynthWave", pixels: 1521, level: "NOVICE", isYou: false },
      { id: 11, username: "zClut", pixels: 1498, level: "NOVICE", isYou: true },
      { id: 12, username: "DataDrifter", pixels: 1342, level: "NOVICE", isYou: false },
      { id: 13, username: "ByteHunter", pixels: 1187, level: "NOVICE", isYou: false },
      { id: 14, username: "GridWalker", pixels: 1054, level: "INITIATE", isYou: false },
      { id: 15, username: "PixelPioneer", pixels: 876, level: "INITIATE", isYou: false },
    ]

    // Asignar rangos
    const rankedUsers = users
      .sort((a, b) => b.pixels - a.pixels)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }))

    setLeaderboard(rankedUsers)
  }, [])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-400" />
    if (rank === 2) return <Trophy className="h-4 w-4 text-gray-400" />
    if (rank === 3) return <Trophy className="h-4 w-4 text-amber-700" />
    return <span className="text-green-700">#{rank}</span>
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "MASTER":
        return "text-red-500"
      case "ELITE":
        return "text-purple-500"
      case "ADEPT":
        return "text-blue-500"
      case "SKILLED":
        return "text-cyan-500"
      case "NOVICE":
        return "text-green-500"
      default:
        return "text-yellow-500"
    }
  }

  return (
    <ScrollArea className="h-[300px] w-full">
      <div className="p-2 space-y-1 font-mono text-xs">
        <div className="grid grid-cols-12 gap-2 text-purple-700 border-b border-purple-900/50 pb-1 mb-2">
          <div className="col-span-1">#</div>
          <div className="col-span-5">USER</div>
          <div className="col-span-3 text-right">PIXELS</div>
          <div className="col-span-3 text-right">LEVEL</div>
        </div>

        {leaderboard.map((entry) => (
          <div
            key={entry.id}
            className={`grid grid-cols-12 gap-2 py-1 px-1 rounded-sm ${entry.isYou ? "bg-purple-900/20 border border-purple-900/50" : "hover:bg-purple-900/10"}`}
          >
            <div className="col-span-1 flex items-center">{getRankIcon(entry.rank)}</div>
            <div className="col-span-5 flex items-center truncate">
              {entry.isYou ? (
                <span className="text-yellow-500">
                  {entry.username} <span className="text-purple-700">(you)</span>
                </span>
              ) : (
                <span>{entry.username}</span>
              )}
            </div>
            <div className="col-span-3 text-right">{entry.pixels.toLocaleString()}</div>
            <div className={`col-span-3 text-right ${getLevelColor(entry.level)}`}>{entry.level}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
