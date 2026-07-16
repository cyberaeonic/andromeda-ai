from langchain_core.tools import tool


@tool
def triage_patient(symptoms: str, vitals: dict) -> str:
    """Uses AI guidelines to triage a patient based on symptoms and vitals."""
    return "Triage Result: Level 2 (Emergent). Requires immediate doctor attention."


@tool
def assign_doctor(patient_id: str, specialty: str) -> str:
    """Assigns the best available doctor for a specific specialty to the patient."""
    return f"Assigned Dr. House (Specialty: {specialty}) to patient {patient_id}."
