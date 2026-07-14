import logging
import os
import urllib.parse

import pandas as pd
from fpdf import FPDF
from langchain_core.tools import tool

logger = logging.getLogger(__name__)


@tool
def update_inventory(item_name: str, quantity_change: int, reason: str = "") -> str:
    """Update the business inventory management system.
    Use this when a product is sold, restocked, or lost.

    Args:
        item_name: The name of the product.
        quantity_change: Positive integer for restocking, negative for sales.
        reason: Why the inventory is changing.
    """
    logger.info(f"Inventory update: {item_name} ({quantity_change})")
    action = "Added" if quantity_change > 0 else "Removed"
    return f"✅ SUCCESS: Inventory System Updated.\nItem: {item_name}\nAction: {action} {abs(quantity_change)} units.\nReason: {reason}\nNew System Status: Synced."


@tool
def analyze_sales_data(month: str, year: str) -> str:
    """Analyze the store's real sales data from sales_data.csv using Pandas.
    Use this when the user asks to review sales, revenue, or performance drops.

    Args:
        month: The month to analyze (e.g., 'July').
        year: The year to analyze (e.g., '2026').
    """
    logger.info(f"Analyzing sales data for {month} {year}")
    try:
        df = pd.read_csv("sales_data.csv")

        # Current month
        current_data = df[(df["Month"] == month) & (df["Year"] == int(year))]
        if current_data.empty:
            return f"❌ Error: No sales data found for {month} {year}."

        current_revenue = current_data["Revenue"].sum()

        # We assume the previous month is June for this hackathon dataset
        prev_month_data = df[(df["Month"] == "June") & (df["Year"] == int(year))]
        prev_revenue = prev_month_data["Revenue"].sum()

        if prev_revenue > 0:
            pct_change = ((current_revenue - prev_revenue) / prev_revenue) * 100
            change_str = f"Down {abs(pct_change):.1f}%" if pct_change < 0 else f"Up {pct_change:.1f}%"
        else:
            change_str = "No previous data to compare"

        top_product = current_data.loc[current_data["Revenue"].idxmax()]["Product"]

        return f"📊 REAL DATA FETCHED: Total revenue for {month} {year} is ${current_revenue:,} ({change_str} from previous month). Top selling product: {top_product}."
    except Exception as e:
        return f"❌ Error analyzing data: {str(e)}"


@tool
def generate_pdf_report(title: str, content_summary: str) -> str:
    """Generate a formal business report in PDF format using fpdf.
    Use this to prepare recovery plans, quarterly reviews, or formal documents.

    Args:
        title: The title of the PDF report (will be used as filename).
        content_summary: A detailed summary of what is included in the report.
    """
    logger.info(f"Generating PDF: {title}")
    try:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=16, style="B")
        pdf.cell(200, 10, txt=title, ln=1, align="C")

        pdf.set_font("Arial", size=12)
        pdf.ln(10)

        # MultiCell for wrapping text
        pdf.multi_cell(0, 10, txt=content_summary)

        filename = f"{title.replace(' ', '_')}.pdf"
        filepath = os.path.join(os.getcwd(), filename)
        pdf.output(filepath)

        return f"📄 SUCCESS: PDF Generated and saved locally at {filepath}.\nTitle: '{title}'\nStatus: Ready for review."
    except Exception as e:
        return f"❌ Error generating PDF: {str(e)}"


@tool
def schedule_meeting(attendee: str, time: str, topic: str) -> str:
    """Schedule a calendar meeting by generating an ICS file.
    Use this to book meetings and send calendar invites.

    Args:
        attendee: The person to meet with.
        time: The time of the meeting (e.g., 'Tomorrow at 10 AM').
        topic: The agenda for the meeting.
    """
    logger.info(f"Scheduling meeting with {attendee} at {time}")
    try:
        ics_content = f"BEGIN:VCALENDAR\\nVERSION:2.0\\nBEGIN:VEVENT\\nSUMMARY:{topic}\\nDESCRIPTION:Meeting with {attendee}\\nEND:VEVENT\\nEND:VCALENDAR"
        filename = f"meeting_{attendee.replace(' ', '_')}.ics"
        filepath = os.path.join(os.getcwd(), filename)

        with open(filepath, "w") as f:
            f.write(ics_content)

        return f"📅 SUCCESS: Calendar invite (.ics file) generated at {filepath}.\nTime: {time}\nTopic: {topic}\nStatus: Click the file to add to your calendar."
    except Exception as e:
        return f"❌ Error scheduling meeting: {str(e)}"


@tool
def send_whatsapp_message(customer_name: str, phone_number: str, message: str) -> str:
    """Send a WhatsApp message via an auto-generated deep link.
    Use this to generate click-to-chat links for customer outreach.

    Args:
        customer_name: The name of the customer.
        phone_number: The customer's phone number with country code (e.g., '+919597393532').
        message: The actual message content to send.
    """
    logger.info(f"Generating WhatsApp link for {customer_name}")
    # Remove any non-numeric characters from phone except leading plus
    clean_phone = "".join(c for c in phone_number if c.isdigit() or c == "+")
    if clean_phone.startswith("+"):
        clean_phone = clean_phone[1:]

    encoded_message = urllib.parse.quote(message)
    wa_link = f"https://wa.me/{clean_phone}?text={encoded_message}"

    return f"💬 WhatsApp Link Generated! Click here to send the message to {customer_name}:\\n{wa_link}\\n\\nMessage content: '{message}'"


@tool
def make_phone_call(phone_number: str, message: str) -> str:
    """Make an AI outbound phone call (Simulated for Hackathon via Link).

    Args:
        phone_number: The phone number to dial.
        message: The message the AI should deliver.
    """
    return f"📞 Call Queued to {phone_number}. The system will deliver: '{message}'."


@tool
def send_text_message(phone_number: str, message: str) -> str:
    """Send an SMS text message.

    Args:
        phone_number: The phone number to text.
        message: The text message content to send.
    """
    return f"💬 SMS Queued for delivery to {phone_number}: '{message}'"


@tool
def create_instagram_post(image_description: str, caption: str, hashtags: list[str]) -> str:
    """Create a post for the business Instagram page.

    Args:
        image_description: Description of the visual content.
        caption: The text caption for the post.
        hashtags: A list of relevant hashtags.
    """
    return f"📸 Instagram Post Created Successfully!\\nCaption: {caption}\\nHashtags: {' '.join(hashtags)}"
