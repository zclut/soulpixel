import { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@nanostores/react";
import { feedList, selectedColor } from "@/store";

interface Props {
  username: string;
}

export default function Feed({ username }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const $feedList = useStore(feedList);

  const handleOnSelectColor = (color: string) => {
    selectedColor.set(color);
  };

  return (
    <>
      {$feedList.length === 0 ? (
        <div className="h-full flex items-center text-center">
          <p className="text-yellow-500 text-xl font-mono mt-5 ">
            The soul is silent... no echoes have reached this corner yet{" "}
          </p>
        </div>
      ) : (
        <ScrollArea className="h-full w-full" ref={scrollRef}>
          <div className="p-2 space-y-1 font-mono text-xs ">
            {$feedList.map((feed) => (
              <div
                key={feed.uuid}
                className="inline-block items-start gap-1 group animate-fadeIn w-full"
              >
                <span className="text-fuchsia-500">
                  <span className="text-purple-700 ">
                    {`[${feed.created_at}] `}{" "}
                  </span>{" "}
                  <span className="text-yellow-500 ">
                    {`${feed.user}${username == feed.user ? " (you)" : ""}: `}
                  </span>
                  {feed.message}
                  <span className="ml-1 text-yellow-500 ">
                    ({feed.x} {feed.y})
                  </span>
                  <span
                    onClick={() => handleOnSelectColor(feed.color)}
                    className="ml-1 w-3 h-3 rounded-md mt-1 border border-gray-800 cursor-pointer"
                    style={{ backgroundColor: feed.color }}
                  >
                    &nbsp;&nbsp;
                  </span>
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </>
  );
}
