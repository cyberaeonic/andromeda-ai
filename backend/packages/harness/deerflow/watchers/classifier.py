from typing import Any


class EventClassifier:
    """
    Classifies raw changes into standard Business Events.
    Uses simple rules to map data source patterns to business semantics.
    """

    def __init__(self, business_context: str = "healthcare"):
        self.business_context = business_context

    def classify(self, raw_change: dict[str, Any]) -> dict[str, Any] | None:
        """
        Takes a raw change (e.g. {"raw_action": "row_added", "data": {"patient_id": "P1"}})
        and returns a Business Event (e.g. {"event": "patient.registered", "payload": {...}})
        """

        # Simple rule-based classifier for the Hackathon
        if self.business_context == "healthcare":
            return self._classify_healthcare(raw_change)
        elif self.business_context == "retail":
            return self._classify_retail(raw_change)

        return None

    def _classify_healthcare(self, raw_change: dict[str, Any]) -> dict[str, Any] | None:
        data = raw_change.get("data", {})

        # Example 1: A new row in a file that looks like a patient record
        if raw_change.get("raw_action") == "row_added":
            if "patient_name" in data or "patient_id" in data:
                return {"event": "patient.registered", "payload": data}
            if "bed_id" in data or "room_type" in data:
                return {"event": "facilities.bed_added", "payload": data}

        # Example 2: A webhook payload with specific fields
        if raw_change.get("raw_action") == "webhook_received":
            # Webhook from a form
            if "triage_priority" in data:
                return {"event": "patient.triaged", "payload": data}
            # Fallback generic event
            return {"event": "healthcare.webhook_alert", "payload": data}

        return None

    def _classify_retail(self, raw_change: dict[str, Any]) -> dict[str, Any] | None:
        # Stubs for retail context
        data = raw_change.get("data", {})
        if "sku" in data and "stock" in data:
            if int(data.get("stock", 0)) < 10:
                return {"event": "inventory.low", "payload": data}
        return None
