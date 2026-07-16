"use client";

import { Activity } from "lucide-react";
import React, { useEffect, useState } from "react";

import { LiveTimeline } from "@/components/watcher/LiveTimeline";
import { WatcherStatus } from "@/components/watcher/WatcherStatus";

interface EventEntry {
  thread_id: string | null;
  event: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export default function DashboardPage() {
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  // Poll for new events every 2 seconds
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/webhooks/events");
        const data: EventEntry[] = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    void fetchEvents();
    const interval = setInterval(() => {
      void fetchEvents();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-gray-100 selection:bg-blue-500/30">
      <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center opacity-10" />

      <main className="relative container mx-auto max-w-6xl px-4 py-8">
        <WatcherStatus />

        <div className="mt-8 flex flex-col gap-8 md:flex-row">
          {/* Left Panel: Event Feed */}
          <div className="w-full space-y-4 md:w-1/3">
            <h2 className="border-b border-gray-800 pb-2 text-xl font-bold">
              Active Events
            </h2>
            {events.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No events detected yet. Waiting for webhooks...
              </p>
            ) : (
              <div className="space-y-3">
                {events.map((evt, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      evt.thread_id && setSelectedThreadId(evt.thread_id)
                    }
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${selectedThreadId === evt.thread_id ? "border-blue-500/50 bg-blue-900/30" : "border-gray-800 bg-gray-900/50 hover:border-gray-600"}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-400">
                        {evt.event}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-gray-400">
                      {JSON.stringify(evt.payload)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel: Live Timeline SSE Stream */}
          <div className="w-full md:w-2/3">
            <h2 className="mb-4 border-b border-gray-800 pb-2 text-xl font-bold">
              Agent Execution Stream
            </h2>
            {selectedThreadId ? (
              <LiveTimeline threadId={selectedThreadId} />
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 bg-gray-900/20 text-gray-500">
                <Activity className="mb-4 h-8 w-8 opacity-50" />
                <p>Select an event to view the live execution stream</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
