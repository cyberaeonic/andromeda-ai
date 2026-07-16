import json
import os
import threading
import time
from typing import Any

from .base import BaseWatcher


class FileWatcher(BaseWatcher):
    """
    Watches a local JSON file (acting as a mock database table).
    Emits raw events when data is appended.
    """

    def __init__(self, name: str, file_path: str, poll_interval_sec: int = 5):
        super().__init__(name)
        self.file_path = file_path
        self.poll_interval = poll_interval_sec
        self._thread = None
        self._previous_state = []

    def fetch_data(self) -> Any:
        if not os.path.exists(self.file_path):
            return []
        try:
            with open(self.file_path) as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
                return [data]  # Ensure it's a list for easy diffing
        except Exception:
            return []

    def detect_changes(self, previous_state: list, current_state: list) -> list[dict[str, Any]]:
        changes = []
        # Simple detection: if current has more items, they are new rows
        if len(current_state) > len(previous_state):
            new_items = current_state[len(previous_state) :]
            for item in new_items:
                changes.append({"raw_action": "row_added", "file_path": self.file_path, "data": item})
        return changes

    def _loop(self):
        self._previous_state = self.fetch_data()
        while self.is_running:
            time.sleep(self.poll_interval)
            current_state = self.fetch_data()
            changes = self.detect_changes(self._previous_state, current_state)
            for change in changes:
                self.emit_raw_change(change)
            self._previous_state = current_state

    def start(self):
        if self.is_running:
            return
        super().start()
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()

    def stop(self):
        super().stop()
        if self._thread:
            self._thread.join(timeout=2)
