# 🚀 Andromeda OS: The Autonomous Operations Coordinator

**Built for the Takeover Hackathon (NIAT) — Powered by Deer Flow**

---

## 🛑 The Problem

Current business software is entirely passive. Whether it's a hospital, hotel, or retail store, staff are forced to manually click through screens to enter data, book rooms, generate reports, and notify other departments. This manual data entry delays care and service, causes employee burnout, and creates massive bottlenecks during busy shifts.

## 💡 The Solution: Active, Agentic AI

**Andromeda OS** is not a standard chatbot that just answers trivia questions. It is an **Agentic AI**—an autonomous digital manager that actively runs your operations in the real world. 

When a business event occurs (e.g., a new patient arrives or a booking is made via Google Sheets), Andromeda OS wakes up in the background, reasons about the event, and autonomously fires a sequence of real-world tools to handle the entire workflow completely hands-free.

---

## 🔥 Key Features (Live Demo Capabilities)

Andromeda OS operates entirely headlessly via webhooks, acting as the invisible brain of your business operations.

### 🏥 Healthcare Triage Example (Live Demo)
1. **Google Sheets Webhook:** A new patient is added to an intake Google Sheet.
2. **Autonomous Triage:** Andromeda OS calls the `triage_patient` tool to analyze symptoms.
3. **Resource Allocation:** It calls `allocate_room` to find an available bed.
4. **Staff Assignment:** It calls `assign_doctor` to find the correct specialist.
5. **Document Generation:** It calls `generate_medical_report` to create a physical PDF record.
6. **Live Notifications:** It calls `send_telegram_notification` to instantly send a beautifully formatted HTML operations ticket directly to the staff's phones.

*All of this happens in 3 seconds, with 0 human button-clicks.*

### 🏨 Adaptable for Any Industry
Because it is powered by an LLM with access to an arsenal of tools, it can instantly be adapted for:
- **Hotels / Hostels:** Autonomously checking in guests, generating invoices, and messaging housekeeping.
- **Retail:** Updating inventory levels, contacting suppliers, and logging sales.
- **Service Businesses:** Booking appointments, processing Stripe payments, and sending Slack webhooks.

---

## 🛠️ The Tech Stack

- **Agentic Framework:** LangGraph (Python)
- **Backend API:** FastAPI 
- **Frontend UI:** Next.js 15, TypeScript, Tailwind CSS
- **Database:** SQLite / DuckDB
- **Integrations:** Telegram Bot API, Google Apps Script Webhooks

---

## 🚀 Quick Start

```bash
make dev       # Start development server
make start     # Start production server
make stop      # Stop all services
```

---

© Built for Takeover Hackathon NIAT.
