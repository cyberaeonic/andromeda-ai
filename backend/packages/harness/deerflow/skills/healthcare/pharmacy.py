from langchain_core.tools import tool


@tool
def book_pharmacy_prescription(patient_id: str, medications: list[str]) -> str:
    """Sends a prescription request to the hospital pharmacy for a patient."""
    return f"Pharmacy order placed for Patient {patient_id}. Medications: {', '.join(medications)}."
