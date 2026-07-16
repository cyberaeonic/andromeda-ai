import React from "react";

import { LiveTimeline } from "@/components/watcher/LiveTimeline";
import { WatcherStatus } from "@/components/watcher/WatcherStatus";

export const metadata = {
  title: "Live Event Dashboard | Andromeda",
  description: "Monitor autonomous AI workflows in real-time.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-gray-100 selection:bg-blue-500/30">
      <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center opacity-10" />

      <main className="relative container mx-auto max-w-4xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
            Andromeda Watcher
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Real-time event streaming and autonomous workflow execution. Watch
            as the AI planner reacts to business events dynamically.
          </p>
        </div>

        <WatcherStatus />

        <LiveTimeline />
      </main>
    </div>
  );
}
