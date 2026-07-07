"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function FableBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] h-full w-full overflow-hidden bg-[#050B14]">
      {/* Mystical glowing orbs */}
      <motion.div
        animate={{
          x: ["0%", "5%", "-5%", "0%"],
          y: ["0%", "-5%", "5%", "0%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full bg-amber-500/10 mix-blend-screen blur-[120px]"
      />
      <motion.div
        animate={{
          x: ["0%", "-5%", "5%", "0%"],
          y: ["0%", "5%", "-5%", "0%"],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-10%] bottom-[-20%] h-[60%] w-[60%] rounded-full bg-blue-600/10 mix-blend-screen blur-[120px]"
      />
      {/* Floating particles (fireflies/magic dust) */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: ["0vh", "-100vh"],
              x: Math.random() > 0.5 ? ["0vw", "10vw"] : ["0vw", "-10vw"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear",
            }}
            className="absolute bottom-0 h-1 w-1 rounded-full bg-amber-300 blur-[1px]"
            style={{
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
