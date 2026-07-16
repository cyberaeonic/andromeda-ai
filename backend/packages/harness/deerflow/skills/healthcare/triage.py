from langchain_core.tools import tool

# Simple long-term memory for the demo
HOSPITAL_DOCTORS = [
    {"name": "Dr. Gregory House", "specialty": "Diagnostic Medicine", "is_available": True},
    {"name": "Dr. Allison Cameron", "specialty": "Immunology", "is_available": True},
    {"name": "Dr. Robert Chase", "specialty": "Intensive Care", "is_available": False},
    {"name": "Dr. Eric Foreman", "specialty": "Neurology", "is_available": True},
    {"name": "Dr. James Wilson", "specialty": "Oncology", "is_available": True},
    {"name": "Dr. Stephen Strange", "specialty": "Surgery", "is_available": True},
    {"name": "Dr. John Dorian", "specialty": "Internal Medicine", "is_available": True},
    {"name": "Dr. Perry Cox", "specialty": "Internal Medicine", "is_available": False},
    {"name": "Dr. Cristina Yang", "specialty": "Cardiology", "is_available": True},
    {"name": "Dr. Meredith Grey", "specialty": "General Surgery", "is_available": True},
]


@tool
def triage_patient(symptoms: str, vitals: dict) -> str:
    """Uses AI guidelines to triage a patient based on symptoms and vitals. Returns the recommended specialty."""
    # A smart AI would map symptoms to specialty. This just simulates the triage system.
    return "Triage Result: Level 2 (Emergent). AI recommends routing to Cardiology, Surgery, or Internal Medicine based on analysis."


@tool
def assign_doctor(patient_id: str, specialty: str) -> str:
    """Assigns the best available doctor matching the requested specialty from the hospital's long-term memory system."""

    # Check availability
    available_doctors = [doc for doc in HOSPITAL_DOCTORS if doc["specialty"].lower() == specialty.lower() and doc["is_available"]]

    if not available_doctors:
        # Fallback to general/internal medicine if specialty is full
        backup_doctors = [doc for doc in HOSPITAL_DOCTORS if "medicine" in doc["specialty"].lower() and doc["is_available"]]
        if not backup_doctors:
            return f"CRITICAL: No available doctors found for {specialty}, and all backup general medics are busy. Please trigger emergency overflow protocols."

        assigned = backup_doctors[0]
        assigned["is_available"] = False
        return f"Warning: No available {specialty} doctors. Re-routed to backup medic: {assigned['name']} ({assigned['specialty']}) assigned to patient {patient_id}. Status marked as Unavailable."

    assigned = available_doctors[0]
    assigned["is_available"] = False
    return f"Success: {assigned['name']} (Specialty: {assigned['specialty']}) assigned to patient {patient_id}. Status marked as Unavailable."
