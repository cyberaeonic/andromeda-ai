from typing import Any

from .base import BaseWatcher


class WebhookWatcher(BaseWatcher):
    """
    Acts as a bridge for HTTP webhooks.
    Instead of polling, the FastAPI route will push data into this watcher,
    which immediately emits it as a raw change.
    """

    def __init__(self, name: str):
        super().__init__(name)

    def start(self):
        super().start()

    def stop(self):
        super().stop()

    def fetch_data(self) -> Any:
        # Data is pushed, not fetched
        return None

    def detect_changes(self, previous_state: Any, current_state: Any) -> list[dict[str, Any]]:
        # Data is pushed as discrete events
        return []

    def receive_webhook(self, payload: dict[str, Any], source_url: str):
        """Called by the FastAPI router when a webhook arrives."""
        if not self.is_running:
            return

        raw_change = {"raw_action": "webhook_received", "source_url": source_url, "data": payload}
        self.emit_raw_change(raw_change)
