from abc import ABC, abstractmethod
from collections.abc import Callable
from typing import Any


class BaseWatcher(ABC):
    """
    Abstract base class for all Data-Source Watchers.
    Watchers detect raw changes in a specific data source (files, webhooks, DBs)
    and emit raw events to an EventClassifier.
    """

    def __init__(self, name: str):
        self.name = name
        self.is_running = False
        self._on_change_callbacks: list[Callable[[dict[str, Any]], None]] = []

    def register_callback(self, callback: Callable[[dict[str, Any]], None]):
        """Register a callback to be invoked when a raw change is detected."""
        self._on_change_callbacks.append(callback)

    def emit_raw_change(self, raw_change: dict[str, Any]):
        """Emit a raw change to all registered callbacks (usually the EventClassifier)."""
        raw_change["source_watcher"] = self.name
        for callback in self._on_change_callbacks:
            try:
                callback(raw_change)
            except Exception as e:
                # Log exception but don't crash watcher
                print(f"Error in watcher callback: {e}")

    @abstractmethod
    def start(self):
        """Start the watcher loop or listener."""
        self.is_running = True

    @abstractmethod
    def stop(self):
        """Stop the watcher loop or listener."""
        self.is_running = False

    @abstractmethod
    def fetch_data(self) -> Any:
        """Fetch current data state."""
        pass

    @abstractmethod
    def detect_changes(self, previous_state: Any, current_state: Any) -> list[dict[str, Any]]:
        """Compare states and return a list of raw changes."""
        pass
