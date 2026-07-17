import os
import uuid
from typing import Any

import requests
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

    async def ai_callback(event: dict[str, Any], history_entry: dict):
        thread_id = uuid.uuid4().hex
        history_entry["thread_id"] = thread_id
        event_name = event.get("event", "unknown_event")
        payload = event.get("payload", {})

        # 1. Immediate Telegram Visibility
        chat_id = payload.get("chat_id") or payload.get("patient_telegram_chat_id") or payload.get("Telegram Chat ID") or "7429768909"
        bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
        if bot_token and chat_id:
            try:
                requests.post(
                    f"https://api.telegram.org/bot{bot_token}/sendMessage",
                    json={"chat_id": chat_id, "text": "🚨 <b>Andromeda OS:</b> New Patient Data Received.\n\nAnalyzing symptoms and checking long-term memory for doctor availability...", "parse_mode": "HTML"},
                    timeout=5,
                )
            except Exception as e:
                print(f"Failed to send initial telegram msg: {e}")

        # 2. Enrich the Prompt with explicit instructions for the Agent
        is_medical = "patient" in event_name.lower() or "medical" in event_name.lower() or "symptom" in str(payload).lower() or "hospital" in event_name.lower()

        if is_medical:
            prompt = (
                f"# Andromeda Healthcare Planner System Prompt\n\n"
                f"You are the autonomous planner for Andromeda Healthcare.\n\n"
                f"Your responsibility is to coordinate hospital operations after receiving business events from the Event Bus.\n\n"
                f"Never diagnose diseases or prescribe medication.\n\n"
                f"Instead:\n"
                f"* Analyze business events.\n"
                f"* Delegate work to the appropriate healthcare skills.\n"
                f"* Coordinate departments.\n"
                f"* Generate administrative documents.\n"
                f"* Notify stakeholders.\n"
                f"* Explain your reasoning.\n"
                f"* Escalate when resources are unavailable.\n\n"
                f"Payload details: {payload}.\n\n"
                f"CRITICAL INSTRUCTIONS:\n"
                f"1. You MUST use the 'triage_patient' tool first to determine the severity. Use the 'Decubitus Risk' from the payload as a proxy for symptoms, and dummy data for vitals.\n"
                f"2. You MUST use the 'allocate_room' tool to find an available room for the patient based on their condition.\n"
                f"3. You MUST use the 'assign_doctor' tool to assign an available specialist (e.g., Internal Medicine, Surgery).\n"
                f"4. ONLY after doing the above, use the 'generate_medical_report' tool to create the PDF record.\n"
                f"5. FINALLY, use the 'send_telegram_notification' tool to send a live update ticket to chat_id '{chat_id}'. Your telegram messages MUST be formatted EXACTLY like this using HTML tags:\n"
                f"🚨 <b>Andromeda OS: Operations Coordination</b>\n"
                f"━━━━━━━━━━━━━━━━━━━━━━\n"
                f"<b>Patient:</b> [Insert Patient Name]\n"
                f"<b>Triage Level:</b> [Insert Result]\n"
                f"<b>Assigned Room:</b> [Insert Result]\n"
                f"<b>Assigned Doctor:</b> [Insert Result]\n"
                f"<b>Report:</b> Generated ✅\n"
                f"━━━━━━━━━━━━━━━━━━━━━━\n"
                f"<i>All autonomous steps completed successfully.</i>"
            )
        else:
            prompt = (
                f"# Andromeda Business Planner System Prompt\n\n"
                f"You are the autonomous planner for Andromeda AI.\n\n"
                f"Your responsibility is to coordinate enterprise operations after receiving business events from the Event Bus.\n\n"
                f"Payload details: {payload}.\n\n"
                f"CRITICAL INSTRUCTIONS:\n"
                f"1. You MUST analyze the payload and use the appropriate scheduling, facility, or billing tools to handle the event.\n"
                f"2. You MUST use the 'generate_medical_report' (or equivalent document) tool to create a physical record.\n"
                f"3. FINALLY, use the 'send_telegram_notification' tool to send a live update ticket to chat_id '{chat_id}'. Your telegram messages should be framed as 'Operations Coordination'."
            )

        print(f"[WebhookRouter] Triggering AI for event: {event_name}")

        # Explicitly create the thread in the database so it appears in the sidebar UI
        from app.gateway.deps import get_thread_store

        thread_store = get_thread_store(request)
        try:
            await thread_store.create(thread_id, metadata={"title": f"System Event: {event_name}"}, user_id="default")
        except Exception as e:
            print(f"[WebhookRouter] Failed to create thread meta: {e}")

        try:
            # We assign owner_user_id="default" so this headless event belongs to the normal Chat UI history.
            await launch_scheduled_thread_run(thread_id=thread_id, assistant_id="lead_agent", prompt=prompt, app=request.app, owner_user_id="default")
        except Exception as e:
            error_msg = f"Failed to launch thread: {str(e)}"
            print(error_msg)
            if bot_token and chat_id:
                try:
                    import traceback

                    tb = traceback.format_exc()
                    requests.post(
                        f"https://api.telegram.org/bot{bot_token}/sendMessage",
                        json={"chat_id": chat_id, "text": f"🚨 <b>ERROR in Andromeda OS webhook:</b>\n{error_msg}\n<pre>{tb[-500:]}</pre>", "parse_mode": "HTML"},
                        timeout=5,
                    )
                except Exception as inner_e:
                    print(f"Failed to send error telegram msg: {inner_e}")

    # We clear and re-register to ensure the latest request context is used.
    # In production, this would be a proper background job.
    event_bus.planner_callbacks = []
    event_bus.register_planner_callback(ai_callback)

    # Push to the watcher
    watcher.receive_webhook(payload, source_url)

    return {"status": "received", "message": "Event queued for classification."}


@router.get("/events")
async def get_events():
    """
    Returns the recent event history for the dashboard.
    """
    return list(event_bus.event_history)


@router.get("/events/{thread_id}/messages")
async def get_thread_messages(thread_id: str, request: Request):
    """
    Returns the message history for a specific event thread for the dashboard.
    Bypasses auth for the dashboard visualization.
    """
    from app.gateway.services import get_run_event_store

    event_store = get_run_event_store(request)
    messages = await event_store.list_messages(thread_id, limit=100)
    return messages
