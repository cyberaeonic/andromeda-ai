"use client";

import { useEffect, useState } from "react";

/**
 * Fable 5 — enchanted night sky background.
 * Uses a deep indigo/amber gradient with CSS-animated stars and a warm golden
 * nebula bloom. Zero WebGL, zero Canvas — pure CSS so it never blocks the
 * main thread during heavy text streaming.
 */
export function MilkyWayBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      {/* Deep enchanted night gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #020111 0%, #0a0520 25%, #130a2a 50%, #0d0818 75%, #020111 100%)",
        }}
      />

      {/* Warm golden nebula glow — top-left */}
      <div
        className="absolute -top-[10%] -left-[15%] h-[50%] w-[50%] rounded-full opacity-[0.06]"
        style={{
          background:
            "radial-gradient(ellipse at center, #d4a017 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "nebulaFloat1 25s ease-in-out infinite alternate",
        }}
      />
      {/* Cool blue nebula — bottom-right */}
      <div
        className="absolute -right-[10%] -bottom-[15%] h-[50%] w-[50%] rounded-full opacity-[0.05]"
        style={{
          background:
            "radial-gradient(ellipse at center, #3b82f6 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "nebulaFloat2 30s ease-in-out infinite alternate",
        }}
      />
      {/* Violet accent bloom — center */}
      <div
        className="absolute top-[45%] left-[35%] h-[30%] w-[30%] rounded-full opacity-[0.04]"
        style={{
          background:
            "radial-gradient(ellipse at center, #8b5cf6 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "nebulaFloat3 20s ease-in-out infinite alternate",
        }}
      />

      {/* Lightweight CSS Stars (Small) */}
      <div className="stars-small absolute inset-0"></div>

      {/* Lightweight CSS Stars (Medium) */}
      <div className="stars-medium absolute inset-0"></div>

      {/* Lightweight CSS Stars (Large — golden tint) */}
      <div className="stars-large absolute inset-0"></div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .stars-small {
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${generateStars(200, "white")};
          animation: animStar 150s linear infinite;
        }
        .stars-small:after {
          content: " ";
          position: absolute;
          top: 2000px;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${generateStars(200, "white")};
        }

        .stars-medium {
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: ${generateStars(80, "white")};
          animation: animStar 200s linear infinite;
        }
        .stars-medium:after {
          content: " ";
          position: absolute;
          top: 2000px;
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: ${generateStars(80, "white")};
        }

        .stars-large {
          width: 3px;
          height: 3px;
          background: transparent;
          box-shadow: ${generateStars(30, "golden")};
          animation: animStar 250s linear infinite;
        }
        .stars-large:after {
          content: " ";
          position: absolute;
          top: 2000px;
          width: 3px;
          height: 3px;
          background: transparent;
          box-shadow: ${generateStars(30, "golden")};
        }

        @keyframes animStar {
          from { transform: translateY(0px); }
          to { transform: translateY(-2000px); }
        }

        @keyframes nebulaFloat1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(5%, -5%) scale(1.1); }
        }
        @keyframes nebulaFloat2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-5%, 5%) scale(1.05); }
        }
        @keyframes nebulaFloat3 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.04; }
          100% { transform: translate(-3%, -3%) scale(1.15); opacity: 0.07; }
        }
        `,
        }}
      />
    </div>
  );
}

// Helper to generate a random CSS box-shadow starfield
function generateStars(count: number, palette: "white" | "golden") {
  let value = "";
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    let color: string;
    if (palette === "golden") {
      const r = Math.random();
      color = r > 0.6 ? "#fde68a" : r > 0.3 ? "#fbbf24" : "#f59e0b";
    } else {
      color = Math.random() > 0.8 ? "#e0f2fe" : "#ffffff";
    }
    value += `${x}px ${y}px ${color}${i === count - 1 ? "" : ", "}`;
  }
  return value;
}
