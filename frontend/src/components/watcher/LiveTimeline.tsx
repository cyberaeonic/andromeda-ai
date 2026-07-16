"use client";

import {
  Activity,
  CheckCircle,
  Clock,
  PlayCircle,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: "watch" | "trigger" | "planner" | "action" | "complete";
  title: string;
  description?: string;
}

interface BackendMessage {
  id?: string;
  created_at?: string;
  content?: string;
  event_type?: string;
  name?: string;
  role?: string;
  kwargs?: Record<string, unknown>;
}

export function LiveTimeline({ threadId }: { threadId: string }) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    let active = true;
    const fetchMessages = async () => {
      if (!threadId) return;
      try {
        const res = await fetch(
          `http://localhost:8000/api/webhooks/events/${threadId}/messages`,
        );
        const messages = await res.json();

        if (!active) return;

        // Map backend messages to Timeline events
        const parsedEvents: TimelineEvent[] = messages.map(
          (msg: BackendMessage) => {
            let type: TimelineEvent["type"] = "planner";
            let title = "Agent Processing";
            let description = msg.content;

            if (msg.event_type === "llm.tool_call") {
              type = "action";
              title = `Executing Tool: ${msg.name}`;
              description = JSON.stringify(msg.kwargs);
            } else if (msg.event_type === "llm.tool_result") {
              type = "complete";
              title = `Tool Result: ${msg.name}`;
              description = msg.content;
            } else if (msg.role === "user") {
              type = "trigger";
              title = "Business Event Received";
            }

            return {
              id: msg.id ?? Math.random().toString(),
              timestamp: new Date(
                msg.created_at ?? Date.now(),
              ).toLocaleTimeString(),
              type,
              title,
              description,
            };
          },
        );

        setEvents(parsedEvents);
      } catch (err) {
        console.error("Failed to fetch thread messages:", err);
      }
    };

    void fetchMessages();
    const interval = setInterval(() => {
      void fetchMessages();
    }, 1500);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [threadId]);

  const getIcon = (type: string) => {
    switch (type) {
      case "watch":
        return <Activity className="h-6 w-6 animate-pulse text-blue-400" />;
      case "trigger":
        return <ShieldAlert className="h-6 w-6 text-yellow-400" />;
      case "planner":
        return <PlayCircle className="h-6 w-6 text-purple-400" />;
      case "action":
        return <Clock className="h-6 w-6 text-orange-400" />;
      case "complete":
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      default:
        return <Activity className="h-6 w-6 text-gray-400" />;
    }
  };

  if (events.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 bg-gray-900/20 text-gray-500">
        <Activity className="mb-4 h-8 w-8 animate-pulse" />
        <p>Loading live stream...</p>
      </div>
    );
  }

  return (
    <div className="max-h-[600px] w-full overflow-y-auto rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
      <div className="space-y-6">
        <AnimatePresence>
          {events.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
              className="relative pl-8"
            >
              {/* Timeline Line */}
              {idx !== events.length - 1 && (
                <div className="absolute top-8 bottom-[-24px] left-[11px] w-[2px] bg-gray-700/50" />
              )}

              {/* Icon */}
              <div className="absolute top-1 left-[-5px] rounded-full border border-gray-700 bg-gray-900 p-1 shadow-sm">
                {getIcon(evt.type)}
              </div>

              {/* Content */}
              <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 p-4 shadow-md backdrop-blur-sm transition-colors hover:bg-gray-800/60">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-100">
                    {evt.title}
                  </h3>
                  <span className="rounded bg-gray-950 px-2 py-1 font-mono text-xs text-gray-400">
                    {evt.timestamp}
                  </span>
                </div>
                {evt.description && (
                  <p className="overflow-x-auto font-mono text-sm text-xs whitespace-pre-wrap text-gray-400">
                    {evt.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
