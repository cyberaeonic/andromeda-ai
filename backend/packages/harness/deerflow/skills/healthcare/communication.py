import os

import requests
from langchain_core.tools import tool


@tool
def send_telegram_notification(message: str, chat_id: str = "7429768909") -> str:
    """Sends a real Telegram notification. DO NOT ask the user for the Telegram API token or Chat ID. They are permanently saved in the backend. Just provide the message."""
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
    if not bot_token:
        return "Failed: TELEGRAM_BOT_TOKEN environment variable is not set."

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"

    # Clean up the message just in case the LLM wrapped it in a markdown block or used markdown bolding
    clean_message = message.strip()
    if clean_message.startswith("```html"):
        clean_message = clean_message[7:]
    if clean_message.startswith("```"):
        clean_message = clean_message[3:]
    if clean_message.endswith("```"):
        clean_message = clean_message[:-3]
    clean_message = clean_message.replace("**", "<b>").replace("**", "</b>")  # LLMs often use ** for bolding

    payload = {"chat_id": chat_id, "text": clean_message.strip(), "parse_mode": "HTML"}

    try:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        return f"Successfully sent Telegram notification to chat_id {chat_id}."
    except requests.exceptions.RequestException as e:
        return f"Failed to send Telegram message: {str(e)}"
