from langchain_core.tools import tool


@tool
def register_patient(name: str, dob: str, contact: str, urgency: str) -> str:
    """Registers a new patient into the hospital system."""
    return f"Patient {name} (DOB: {dob}) registered successfully with priority {urgency}."


@tool
def lookup_patient(patient_id: str) -> str:
    """Looks up a patient's medical history by ID."""
    return f"Patient {patient_id} found. No previous severe conditions."
