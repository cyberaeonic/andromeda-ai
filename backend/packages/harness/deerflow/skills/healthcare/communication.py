import urllib.parse

from langchain_core.tools import tool


@tool
def send_telegram_notification(phone_number: str, message: str) -> str:
    """Sends a deep-linked Telegram notification. Uses no API keys."""
    encoded_message = urllib.parse.quote(message)
    link = f"tg://msg?to={phone_number}&text={encoded_message}"
    # In a real desktop environment, this might use xdg-open.
    return f"Prepared Telegram notification to {phone_number}. Deep link: {link}"
