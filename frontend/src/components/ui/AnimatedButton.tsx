"use client";

import { motion } from "motion/react";
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  glowing?: boolean;
}

export function AnimatedButton({
  children,
  className,
  glowing = true,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative inline-block overflow-hidden rounded-xl p-[1px]",
        className,
      )}
      {...props}
    >
      {glowing && (
        <span className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-black/60 px-6 py-3 backdrop-blur-md transition-colors group-hover:bg-black/40">
        <span className="font-medium whitespace-nowrap text-amber-100">
          {children}
        </span>
      </div>
    </motion.button>
  );
}
