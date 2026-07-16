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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [events, setEvents] = useState<EventEntry[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("andromeda_auth");
      if (auth === "true") setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "cyberaeonic" && password === "1980") {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("andromeda_auth", "true");
      }
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Access Denied.");
    }
  };

  // Poll for new events every 2 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          "https://andromeda-ai-production.up.railway.app/api/webhooks/events",
        );
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
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] font-sans selection:bg-blue-500/30">
        <div className="pointer-events-none absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center opacity-20" />

        <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900/80 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <h1 className="bg-gradient-to-br from-white to-gray-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              Andromeda OS
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Restricted Access. Authenticate to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-black/50 px-4 py-3 text-gray-200 transition-colors focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-black/50 px-4 py-3 text-gray-200 transition-colors focus:border-blue-500 focus:outline-none"
              />
            </div>

            {loginError && (
              <p className="text-center text-sm font-medium text-red-400">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-500 active:scale-95"
            >
              Initialize OS
            </button>
          </form>
        </div>
      </div>
    );
  }

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
