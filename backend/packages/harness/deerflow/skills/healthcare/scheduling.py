from langchain_core.tools import tool


@tool
def book_consultation(patient_id: str, doctor_id: str, preferred_time: str) -> str:
    """Books a medical consultation between a patient and a doctor."""
    return f"Consultation booked for Patient {patient_id} with Doctor {doctor_id} at {preferred_time}."
