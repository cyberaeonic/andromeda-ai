"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function GlobalEventToast() {
  const lastEventCountRef = useRef<number>(-1);

  useEffect(() => {
    // We only poll if we are in the browser
    if (typeof window === "undefined") return;

    let active = true;

    const fetchEvents = async () => {
      try {
        const res = await fetch("https://andromeda-ai-production.up.railway.app/api/webhooks/events");
        if (!res.ok) return;
        
        const data = await res.json();
        if (!active || !Array.isArray(data)) return;

        // If this is the first load, just set the count and don't toast
        if (lastEventCountRef.current === -1) {
          lastEventCountRef.current = data.length;
          return;
        }

        // If the array has grown, it means a new event was received
        if (data.length > lastEventCountRef.current) {
          const newEventsCount = data.length - lastEventCountRef.current;
          const latestEvent = data[0]; // The endpoint returns recent events, usually newest first
          
          if (latestEvent && latestEvent.event) {
            toast.success(`System Event Detected: ${latestEvent.event}`, {
              description: "Operations Coordinator activated in the background.",
              duration: 5000,
            });
          } else {
            toast.success(`${newEventsCount} new event(s) detected`, {
              description: "Agent processing started.",
            });
          }
          lastEventCountRef.current = data.length;
        }
      } catch (err) {
        // Ignore network errors to avoid spamming the console
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(() => {
      void fetchEvents();
    }, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return null; // Invisible component, just runs the logic
}
