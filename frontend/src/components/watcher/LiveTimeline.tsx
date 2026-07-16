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

export function LiveTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: "1",
      timestamp: new Date().toLocaleTimeString(),
      type: "watch",
      title: "Watching Google Forms...",
      description: "Waiting for new patient registration.",
    },
  ]);

  // Simulate an incoming webhook event after 5 seconds for demonstration,
  // since the actual backend SSE hook would require a running server and specific run_id.
  useEffect(() => {
    const sequence = [
      {
        delay: 5000,
        event: {
          id: "2",
          timestamp: new Date().toLocaleTimeString(),
          type: "trigger" as const,
          title: "patient.registered",
          description: "New row detected in Google Sheets.",
        },
      },
      {
        delay: 6000,
        event: {
          id: "3",
          timestamp: new Date().toLocaleTimeString(),
          type: "planner" as const,
          title: "Planner Started",
          description: "LangGraph Agent determining next steps.",
        },
      },
      {
        delay: 8000,
        event: {
          id: "4",
          timestamp: new Date().toLocaleTimeString(),
          type: "action" as const,
          title: "Doctor Assigned: Dr. Rao",
          description: "triage_patient and assign_doctor tools executed.",
        },
      },
      {
        delay: 10000,
        event: {
          id: "5",
          timestamp: new Date().toLocaleTimeString(),
          type: "action" as const,
          title: "Room Allocated: Room 204",
          description: "allocate_room tool executed.",
        },
      },
      {
        delay: 12000,
        event: {
          id: "6",
          timestamp: new Date().toLocaleTimeString(),
          type: "action" as const,
          title: "Telegram Notification Sent",
          description: "Sent deep-link to patient.",
        },
      },
      {
        delay: 13000,
        event: {
          id: "7",
          timestamp: new Date().toLocaleTimeString(),
          type: "complete" as const,
          title: "Workflow Completed",
          description: "All autonomous tasks finished successfully.",
        },
      },
    ];

    const timeouts = sequence.map((step) => {
      return setTimeout(() => {
        setEvents((prev) => [
          ...prev,
          { ...step.event, timestamp: new Date().toLocaleTimeString() },
        ]);
      }, step.delay);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

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

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
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
                  <p className="text-sm text-gray-400">{evt.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
