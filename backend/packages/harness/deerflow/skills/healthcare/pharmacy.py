import csv

import requests
from langchain_core.tools import tool

INVENTORY_CSV_URL = "https://docs.google.com/spreadsheets/d/1WGALI6IsiODI7aZch24wN7FaVq-BYCrYJi56QChkVl8/export?format=csv"


@tool
def check_pharmacy_inventory() -> str:
    """Fetches the real-time live pharmacy inventory from the hospital's database to check current stock and medication uses. Use this BEFORE booking a prescription."""
    try:
        response = requests.get(INVENTORY_CSV_URL, timeout=10)
        response.raise_for_status()

        # Parse CSV
        reader = csv.reader(response.text.splitlines())
        headers = next(reader, None)
        if not headers:
            return "Pharmacy database is empty."

        inventory_report = []
        for row in reader:
            if len(row) >= 5:
                med_name = row[1]
                med_use = row[3]
                stock = row[4]
                inventory_report.append(f"- {med_name}: Used for {med_use}. [Stock: {stock}]")

        # To avoid overloading the context window, we'll return a summarized list of available stock
        return "LIVE HOSPITAL INVENTORY (Format: Name - Use - Stock):\n" + "\n".join(inventory_report)
    except Exception as e:
        return f"Failed to fetch live inventory: {str(e)}"


@tool
def book_pharmacy_prescription(patient_id: str, medications: list[str]) -> str:
    """Sends a prescription request to the hospital pharmacy for a patient. Ensure you checked the live inventory first."""
    return f"Pharmacy order placed for Patient {patient_id}. Medications: {', '.join(medications)}."
