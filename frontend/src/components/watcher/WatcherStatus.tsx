"use client";

import { Activity } from "lucide-react";
import React from "react";

export function WatcherStatus() {
  return (
    <div className="mx-auto mb-8 flex w-full max-w-2xl items-center justify-between rounded-xl border border-green-900/50 bg-gray-950/80 p-4 shadow-lg backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
        </div>
        <h2 className="font-mono text-sm font-medium tracking-wider text-green-400 uppercase">
          Watcher Active
        </h2>
      </div>
      <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
        <Activity className="h-4 w-4" />
        <span>Monitoring Webhook Endpoints</span>
      </div>
    </div>
  );
}
