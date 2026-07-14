import logging

from langchain_core.tools import tool

logger = logging.getLogger(__name__)


@tool
def send_text_message(phone_number: str, message: str) -> str:
    """Send an SMS text message to a given phone number.
    Use this to contact customers, confirm appointments, or send notifications when phone calls are not possible.

    Args:
        phone_number: The phone number to text (e.g., "+919597393532")
        message: The text message content to send.
    """
    logger.info(f"Sending SMS to {phone_number}: {message}")

    # For the hackathon demo, we simulate a successful SMS delivery
    # to avoid dealing with API keys getting revoked by GitHub's public repo scanners.
    return f"Successfully sent SMS text message to {phone_number}. Delivery confirmed."
