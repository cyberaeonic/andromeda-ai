import logging

from langchain_core.tools import tool

logger = logging.getLogger(__name__)


@tool
def make_phone_call(phone_number: str, message: str) -> str:
    """Make an AI outbound phone call to a given phone number with a specific message.
    Use this to contact customers, confirm appointments, issue reminders, or follow up.

    Args:
        phone_number: The phone number to dial (e.g., "+1234567890")
        message: The message the AI should deliver when the user answers.
    """
    logger.info(f"Initiating AI phone call to {phone_number} with message: {message}")

    api_key = "728314c2-4e2e-4e1c-90f9-4ec2e78ae3db"

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    payload = {
        "assistant": {
            "firstMessage": message,
            "model": {
                "provider": "openai",
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "system", "content": "You are a helpful AI assistant making an outbound call on behalf of a small business owner. Deliver the required message and answer any questions concisely."}],
            },
            "voice": {"provider": "11labs", "voiceId": "burt"},
        },
        # You must purchase a number in Vapi dashboard and put its ID here:
        "phoneNumberId": "YOUR_VAPI_PHONE_NUMBER_ID",
        "customer": {"number": phone_number},
    }

    try:
        import requests

        response = requests.post("https://api.vapi.ai/call", json=payload, headers=headers)
        if response.status_code == 201:
            return f"Successfully initiated live AI call to {phone_number} via Vapi."
        else:
            return f"Failed to initiate call. Vapi returned {response.status_code}: {response.text}. (Note: You likely need to purchase a phone number in Vapi and update the 'phoneNumberId' in the code.)"
    except Exception as e:
        return f"Error connecting to Vapi: {str(e)}"
