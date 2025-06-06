import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SignInButton, SignedIn, SignedOut } from "@clerk/astro/react";

export default function LandingPage() {
  const [isTyping, setIsTyping] = useState(true);
  const [typedText, setTypedText] = useState("");
  const fullText =
    "You don't just place a fragment. You leave a trace of who you are.\nAnd something... listens.";

  useEffect(() => {
    if (isTyping) {
      if (typedText.length < fullText.length) {
        const timeout = setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, 60);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
      }
    }
  }, [typedText, isTyping]);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-gradient-radial from-[#120a1a] via-[#0a0a1a] to-[#050510]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 rounded-full bg-purple-900/10 blur-xl"
            initial={{
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: [
                Math.random() * 100 - 50 + "%",
                Math.random() * 100 - 50 + "%",
                Math.random() * 100 - 50 + "%",
              ],
              y: [
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
              ],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: Math.random() * 20 + 15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="mb-12 relative"
        >
          <div className="absolute -inset-1 animate-pulse-slow"></div>
          <h1 className="font-mono text-xl sm:text-2xl md:text-3xl whitespace-pre-line leading-relaxed tracking-wider relative">
            {typedText}
            {isTyping && <span className="animate-pulse">|</span>}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4, duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-violet-800/30 rounded-lg blur-lg group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant={"echo"} className="text-md font-mono cursor-pointer group">
              <span className="relative z-10 group-hover:text-fuchsia-600">Enter the Soul</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#1e1e1e] to-[#2a0a3e] opacity-0  transition-opacity duration-1000"></span>
                <span className="absolute inset-0 bg-[#1a0a2e] opacity-0  glitch-effect"></span>
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <a href="/soul">
              <Button variant={"echo"} className="text-md font-mono cursor-pointer group">
                <span className="relative z-10 group-hover:text-fuchsia-600">Feed the Soul</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#1e1e1e] to-[#2a0a3e] opacity-0  transition-opacity duration-1000"></span>
                <span className="absolute inset-0 bg-[#1a0a2e] opacity-0  glitch-effect"></span>
              </Button>
            </a>
          </SignedIn>
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500 font-mono">
        <p>SoulPixel © {new Date().getFullYear()}</p>
      </div>
    </section>
  );
}
