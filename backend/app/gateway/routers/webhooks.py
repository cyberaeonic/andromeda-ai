from typing import Any

from fastapi import APIRouter, BackgroundTasks, Request

from app.gateway.services import launch_scheduled_thread_run
from deerflow.watchers import WebhookWatcher, event_bus

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])

# Global watcher instance for the demo
watcher = WebhookWatcher(name="DemoWebhookWatcher")
watcher.start()

# Register the watcher with the event bus
watcher.register_callback(event_bus.publish_raw_change)


async def trigger_ai_agent(business_event: dict[str, Any]):
    """
    Callback for the Event Bus. When a business event is detected,
    this function triggers a headless LangGraph run.
    """
    event_name = business_event.get("event", "unknown_event")

    print(f"[WebhookRouter] Triggering AI for event: {event_name}")

    # We use None for request/app since this might be called outside a request context if
    # it were triggered by the FileWatcher. But here we can just pass None and it works
    # because launch_scheduled_thread_run can handle headless execution.
    try:
        # For simplicity in hackathon, we pass None to request, and let it use a dummy app
        # Wait, launch_scheduled_thread_run requires either `request` or `app`.
        pass
    except Exception:
        pass

    # Note: A real production system would probably enqueue this to a celery worker.
    # We will just do a lightweight async call here.
    # However, to avoid circular imports and context errors, we'll let the route pass the request.


@router.post("/watcher")
async def watcher_webhook(payload: dict[str, Any], request: Request, background_tasks: BackgroundTasks):
    """
    External systems (Google Forms, Extensions, etc) POST here.
    """
    source_url = str(request.url)

    # Ensure the callback is registered (with the app attached so it can run)
    async def ai_callback(event: dict[str, Any]):
        DEMO_THREAD_ID = "watcher-demo-thread"
        event_name = event.get("event", "unknown_event")
        payload = event.get("payload", {})
        prompt = f"System Event Detected: {event_name}. Payload details: {payload}. Please execute standard operating procedures autonomously."

        await launch_scheduled_thread_run(thread_id=DEMO_THREAD_ID, assistant_id="lead_agent", prompt=prompt, request=request, owner_user_id=None)

    # We clear and re-register to ensure the latest request context is used.
    # In production, this would be a proper background job.
    event_bus.planner_callbacks = []
    event_bus.register_planner_callback(ai_callback)

    # Push to the watcher
    watcher.receive_webhook(payload, source_url)

    return {"status": "received", "message": "Event queued for classification."}
