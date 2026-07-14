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

    # For the hackathon demo, this simulates a successful call.
    # In production, this would make an HTTP request to Bland AI, Vapi, or Twilio.
    return f"Successfully dialed {phone_number} and delivered the message. The recipient acknowledged and understood the information."
