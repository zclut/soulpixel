"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function TimelapseDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-purple-700/40 text-white hover:bg-purple-900 border border-purple-900/50 rounded-sm text-xs h-8 w-full flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          Unfold the Soul’s Mind
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>The Soul Remembers</DialogTitle>
        </DialogHeader>

        <motion.div
          className="relative aspect-video w-full overflow-hidden rounded-[0.5rem]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="absolute inset-0 w-full h-full rounded-[0.5rem] overflow-hidden">
            <video
              className="w-full h-full object-fill"
              src="https://soulpixel.klasinky.com/timelapse/timelapse.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls={false}
            />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
