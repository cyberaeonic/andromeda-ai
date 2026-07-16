import os

import requests
from langchain_core.tools import tool


@tool
def send_telegram_notification(chat_id: str, message: str) -> str:
    """Sends a real Telegram notification using the TELEGRAM_BOT_TOKEN from environment variables."""
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
    if not bot_token:
        return "Failed: TELEGRAM_BOT_TOKEN environment variable is not set."

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {"chat_id": chat_id, "text": message, "parse_mode": "HTML"}

    try:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        return f"Successfully sent Telegram notification to chat_id {chat_id}."
    except requests.exceptions.RequestException as e:
        return f"Failed to send Telegram message: {str(e)}"
