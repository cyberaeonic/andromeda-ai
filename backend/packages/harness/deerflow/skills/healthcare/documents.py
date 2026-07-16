from langchain_core.tools import tool


@tool
def generate_medical_report(patient_id: str, diagnosis: str, notes: str) -> str:
    """Generates a PDF medical report for a patient."""
    try:
        from fpdf import FPDF

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt=f"Medical Report: Patient {patient_id}", ln=True, align="C")
        pdf.cell(200, 10, txt=f"Diagnosis: {diagnosis}", ln=True)
        pdf.multi_cell(0, 10, txt=f"Notes:\n{notes}")

        file_path = f"medical_report_{patient_id}.pdf"
        pdf.output(file_path)
        return f"Medical report generated successfully at {file_path}"
    except ImportError:
        return f"Simulated medical report generation for Patient {patient_id}. (fpdf not installed)"
