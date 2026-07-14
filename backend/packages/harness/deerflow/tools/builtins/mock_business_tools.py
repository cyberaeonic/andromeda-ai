import logging

from langchain_core.tools import tool

logger = logging.getLogger(__name__)


@tool
def send_whatsapp_message(customer_name: str, phone_number: str, message: str) -> str:
    """Send a WhatsApp Business message to a customer.
    Use this to send order confirmations, promotional offers, or customer support replies via WhatsApp.

    Args:
        customer_name: The name of the customer receiving the message.
        phone_number: The phone number of the customer.
        message: The exact message content to send.
    """
    logger.info(f"Mocking WhatsApp message to {customer_name} ({phone_number})")
    return f"✅ SUCCESS: WhatsApp message delivered to {customer_name} at {phone_number}.\nMessage content: '{message}'"


@tool
def create_instagram_post(caption: str, image_description: str) -> str:
    """Create and publish a post to the business Instagram account.
    Use this for marketing, announcing new products, or engaging with followers.

    Args:
        caption: The text caption and hashtags for the post.
        image_description: A description of the image to be posted.
    """
    logger.info(f"Mocking Instagram post creation with caption: {caption}")
    return f"✅ SUCCESS: Instagram post published!\nImage: [{image_description}]\nCaption: {caption}\nStatus: Live on @YourBusinessAccount"


@tool
def update_inventory(item_name: str, quantity_change: int, reason: str) -> str:
    """Update the inventory levels for a specific product.
    Use this when new stock arrives, or an item is sold, lost, or damaged.

    Args:
        item_name: The name of the product (e.g., 'MacBook Pro 16-inch').
        quantity_change: The number to add or subtract (e.g., 5 or -2).
        reason: The reason for the update (e.g., 'New shipment received' or 'Sold in store').
    """
    logger.info(f"Mocking inventory update: {item_name} ({quantity_change})")
    action = "Added" if quantity_change > 0 else "Removed"
    return f"✅ SUCCESS: Inventory Updated.\nItem: {item_name}\nAction: {action} {abs(quantity_change)} units.\nReason: {reason}\nNew System Status: Synced."
