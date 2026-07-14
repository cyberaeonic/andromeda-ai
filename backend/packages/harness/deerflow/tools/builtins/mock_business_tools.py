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


@tool
def analyze_sales_data(month: str, year: str) -> str:
    """Analyze the store's sales data for a given month and compare it to previous periods.
    Use this when the user asks to review sales, revenue, or performance drops.

    Args:
        month: The month to analyze.
        year: The year to analyze.
    """
    logger.info(f"Mocking sales data analysis for {month} {year}")
    return f"📊 DATA FETCHED: Sales for {month} {year} were $42,500 (Down 18% from last month). Primary factors identified: 1. Seasonal dip in laptop sales. 2. Competitor discount on headphones."


@tool
def generate_pdf_report(title: str, content_summary: str) -> str:
    """Generate a formal business report in PDF format and save it to the company drive.
    Use this to prepare recovery plans, quarterly reviews, or formal documents.

    Args:
        title: The title of the PDF report.
        content_summary: A brief summary of what is included in the report.
    """
    logger.info(f"Mocking PDF generation: {title}")
    return f"📄 SUCCESS: PDF Generated and saved to company drive.\nTitle: '{title}.pdf'\nStatus: Ready for review."


@tool
def schedule_meeting(attendee: str, time: str, topic: str) -> str:
    """Schedule a calendar meeting with an employee, manager, or supplier.
    Use this to book meetings and send calendar invites.

    Args:
        attendee: The person to meet with.
        time: The time of the meeting (e.g., 'Tomorrow at 10 AM').
        topic: The agenda for the meeting.
    """
    logger.info(f"Mocking meeting scheduled with {attendee} at {time}")
    return f"📅 SUCCESS: Calendar invite sent to {attendee}.\nTime: {time}\nTopic: {topic}\nStatus: Confirmed."


@tool
def make_phone_call(phone_number: str, message: str) -> str:
    """Make an AI outbound phone call to a given phone number with a specific message.
    Use this to contact customers, confirm appointments, issue reminders, or follow up.

    Args:
        phone_number: The phone number to dial (e.g., "+1234567890")
        message: The message the AI should deliver when the user answers.
    """
    logger.info(f"Mocking AI phone call to {phone_number} with message: {message}")
    return f"📞 SUCCESS: Live AI call initiated to {phone_number}. The customer received the following message:\n'{message}'\nCall status: Completed successfully."


@tool
def send_text_message(phone_number: str, message: str) -> str:
    """Send an SMS text message to a given phone number.
    Use this to contact customers, confirm appointments, or send notifications.

    Args:
        phone_number: The phone number to text (e.g., "+919597393532")
        message: The text message content to send.
    """
    logger.info(f"Mocking SMS to {phone_number}: {message}")
    return f"💬 SUCCESS: SMS text message successfully delivered to {phone_number}.\nMessage content: '{message}'"
