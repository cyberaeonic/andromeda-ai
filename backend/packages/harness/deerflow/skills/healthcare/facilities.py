from langchain_core.tools import tool


@tool
def allocate_room(patient_id: str, room_type: str) -> str:
    """Allocates a hospital room (e.g., ICU, Ward) to a patient."""
    return f"Allocated 1 {room_type} room for Patient {patient_id}. Room number: 402B."
