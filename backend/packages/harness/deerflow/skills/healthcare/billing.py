from langchain_core.tools import tool


@tool
def generate_bill(patient_id: str, services: list[str]) -> str:
    """Generates an itemized medical bill for a patient."""
    total = len(services) * 150.00
    return f"Generated bill for Patient {patient_id}. Total: ${total}. Services: {', '.join(services)}."
