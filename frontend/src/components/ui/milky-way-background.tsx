"use client";

import { useEffect, useState } from "react";

/**
 * Highly optimized, lightweight background.
 * Uses a static realistic night sky gradient and very simple CSS-animated stars
 * to completely eliminate WebGL rendering lag during heavy text generation.
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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-950"
      style={{ isolation: "isolate" }}
    >
      {/* Realistic Night Sky Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #020111 10%, #20124d 50%, #000022 100%)",
        }}
      />

      {/* Lightweight CSS Stars (Small) */}
      <div className="stars-small absolute inset-0"></div>

      {/* Lightweight CSS Stars (Medium) */}
      <div className="stars-medium absolute inset-0"></div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .stars-small {
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${generateStars(200)};
          animation: animStar 150s linear infinite;
        }
        .stars-small:after {
          content: " ";
          position: absolute;
          top: 2000px;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: ${generateStars(200)};
        }

        .stars-medium {
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: ${generateStars(100)};
          animation: animStar 200s linear infinite;
        }
        .stars-medium:after {
          content: " ";
          position: absolute;
          top: 2000px;
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: ${generateStars(100)};
        }

        @keyframes animStar {
          from { transform: translateY(0px); }
          to { transform: translateY(-2000px); }
        }
        `,
        }}
      />
    </div>
  );
}

// Helper to generate a random CSS box-shadow starfield
function generateStars(count: number) {
  let value = "";
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    const color = Math.random() > 0.8 ? "#e0f2fe" : "#ffffff"; // Mostly white, some light blue
    value += `${x}px ${y}px ${color}${i === count - 1 ? "" : ", "}`;
  }
  return value;
}
