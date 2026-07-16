import asyncio
from collections import deque
from collections.abc import Callable
from datetime import datetime
from typing import Any

from .classifier import EventClassifier


class EventBus:
    """
    Central hub for processing events.
    Watchers push Raw Changes here. The Bus classifies them, and if they map to a
    Business Event, it triggers the registered AI planner callback.
    """

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.classifier = EventClassifier("healthcare")
            cls._instance.planner_callbacks = []
            cls._instance.event_history = deque(maxlen=100)
        return cls._instance

    def register_planner_callback(self, callback: Callable[[dict[str, Any]], None]):
        """Register a callback (like launch_scheduled_thread_run) to handle business events."""
        self.planner_callbacks.append(callback)

    def publish_raw_change(self, raw_change: dict[str, Any]):
        """Called by a Watcher when it detects a change."""
        print(f"[EventBus] Received raw change: {raw_change.get('raw_action')}")
        business_event = self.classifier.classify(raw_change)

        if business_event:
            print(f"[EventBus] Classified as Business Event: {business_event['event']}")

            # Store in history before dispatching so the dashboard can see it immediately
            history_entry = {
                "timestamp": datetime.utcnow().isoformat(),
                "event": business_event.get("event"),
                "payload": business_event.get("payload"),
                "thread_id": None,  # Will be populated by the callback
            }
            self.event_history.appendleft(history_entry)

            self._dispatch_to_planner(business_event, history_entry)
        else:
            print("[EventBus] Raw change ignored (no matching business event).")

    def _dispatch_to_planner(self, business_event: dict[str, Any], history_entry: dict):
        """Dispatches the event to the LangGraph AI."""
        # We need to run the callbacks in an async context if they are async.
        # But we might be in a sync thread (like FileWatcher).

        for callback in self.planner_callbacks:
            try:
                # If it's an async callback (which launch_scheduled_thread_run is),
                # we need to schedule it on the running event loop.
                if asyncio.iscoroutinefunction(callback):
                    try:
                        loop = asyncio.get_running_loop()
                        loop.create_task(callback(business_event, history_entry))
                    except RuntimeError:
                        # No running loop (we are in a worker thread)
                        asyncio.run(callback(business_event, history_entry))
                else:
                    callback(business_event, history_entry)
            except Exception as e:
                print(f"[EventBus] Failed to dispatch to planner: {e}")


# Singleton instance
event_bus = EventBus()
