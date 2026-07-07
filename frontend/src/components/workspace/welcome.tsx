"use client";

import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useI18n } from "@/core/i18n/hooks";
import { cn } from "@/lib/utils";

import { AuroraText } from "../ui/aurora-text";

let waved = false;

function WelcomeDescription({ children }: { children: string }) {
  return (
    <p className="max-w-full text-wrap break-words whitespace-pre-line">
      {children}
    </p>
  );
}

export function Welcome({
  className,
  mode,
}: {
  className?: string;
  mode?: "ultra" | "pro" | "thinking" | "flash";
}) {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const isUltra = useMemo(() => mode === "ultra", [mode]);
  const colors = useMemo(() => {
    if (isUltra) {
      return ["#efefbb", "#e9c665", "#e3a812"];
    }
    return ["#fde68a", "#fbbf24", "#f59e0b"];
  }, [isUltra]);
  useEffect(() => {
    waved = true;
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "mx-auto flex w-full max-w-full flex-col items-center justify-center gap-3 px-4 py-4 text-center sm:px-8",
        className,
      )}
    >
      <div className="max-w-full text-2xl font-bold">
        {searchParams.get("mode") === "skill" ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {`✨ ${t.welcome.createYourOwnSkill} ✨`}
          </motion.span>
        ) : (
          <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
            <motion.div
              className={cn("inline-block", !waved ? "animate-wave" : "")}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            >
              {isUltra ? "🚀" : "✦"}
            </motion.div>
            <AuroraText colors={colors}>{t.welcome.greeting}</AuroraText>
          </div>
        )}
      </div>
      {searchParams.get("mode") === "skill" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground max-w-full text-sm"
        >
          <WelcomeDescription>
            {t.welcome.createYourOwnSkillDescription}
          </WelcomeDescription>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-full text-sm text-white/50"
        >
          <WelcomeDescription>{t.welcome.description}</WelcomeDescription>
        </motion.div>
      )}
    </motion.div>
  );
}
