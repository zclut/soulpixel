import { Info } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover"
import { LEVEL } from "@/lib/const"

export default function RankInfo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-[0.5rem] bg-purple-900/50 p-1.5 text-purple-300 hover:bg-purple-800/60 transition-colors hover:cursor-pointer">
          <Info className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" className="bg-black border border-purple-700 p-3 max-w-[175px] rounded-[0.5rem]">
        <div className="space-y-2 font-mono">
          <h3 className="text-gray-300 text-sm font-bold text-center">FRAGMENTS PER RANK</h3>
          <div className="space-y-1.5">
            {Object.entries(LEVEL).map(([key, level]) => (
              <div key={key} className="flex justify-between items-center">
                <span className={`${level.color} text-xs font-medium`}>{level.text}</span>
                <span className={`${level.color} text-xs`}>{level.pixels}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400 text-center mt-2">Get more fragments to rank up</div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
