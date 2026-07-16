# Andromeda AI — Only powered by Deer Flow 🌌

**Autonomous Business Intelligence Platform — built for TakeOver Hackathon**



---

## Problem Statement

Businesses lack intelligent systems that can automatically execute multi-step workflows — research, analysis, and reporting — without a human manually driving every step. Andromeda AI addresses this by giving business owners autonomous agents that take a single prompt and independently research, analyze, and produce a finished deliverable.

## What is Andromeda AI?

Andromeda AI is an autonomous business intelligence platform that lets you:

- 🤖 **AI Business Chat** — Context-aware enterprise assistant
- 📊 **Data Studio** — Upload & analyze CSV/Excel with real Python execution
- 🔁 **Autonomous Workflows** — Multi-step agents that research, analyze & report without prompting
- 🎯 **Strategic Planning** — KPI tracking & roadmap boards
- 📰 **Trends & News** — Real-time market intelligence via web search
- 📅 **Business Schedule** — Automated workflow scheduling

## Autonomous Workflow Agents (Live)

| Agent | What it does |
|-------|-------------|
| 📊 Data Intelligence Pipeline | Upload CSV → Python analysis → DuckDB queries → Executive Report |
| 🔍 Market Intelligence Scout | Company/Industry → 4-phase web research → Competitive Brief |
| 📋 Executive Weekly Briefing | Business context → KPI benchmarks + trends → Board-ready document |

Each of these runs autonomously end-to-end from a single prompt — no step-by-step hand-holding required.

## 💼 The Boardroom: Multi-Agent Executive Team (Live!)

The core feature of Andromeda AI is the **Boardroom**, where a CEO agent moderates a discussion between specialized AI executives (Finance, Sales, Marketing, Developer, etc.). We've armed these agents with **real business automation super-tools**:

| Agent | Super-Tool | Hackathon-Ready Capability |
|-------|------------|----------------------------|
| 💰 **Sales** | `generate_payment_link` | Instantly generates Stripe checkout URLs to close deals |
| 💰 **Sales** | `send_slack_webhook` | Pings the team Slack channel when a lead is captured |
| 💰 **Sales** | `add_crm_lead` | Automatically records lead data (Name, Company) to a local CRM |
| 👔 **Business** | `generate_pdf_proposal` | Typesets and saves real, downloadable PDF contracts/invoices |
| 👔 **Business** | `schedule_meeting` | Generates `.ics` calendar invites for Google Calendar/Outlook |
| 📈 **Finance** | `web_search_tool` | Scours the internet for live market data, stock prices, and income reports |
| 📧 **Global** | `send_email` | Sends real SMTP outreach emails to prospects (with Safe Simulation mode) |

All tools execute with beautiful **Native Markdown Terminal UI** blocks right in the chat console so you can watch your AI business run itself in real-time.

## Quick Start

```bash
make dev       # Start development server
make start     # Start production server
make stop      # Stop all services
```

## Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI, LangGraph
- **AI:** LLM-powered autonomous agents with real code execution
- **Data:** DuckDB, Pandas, Matplotlib

## Acknowledgments

Built on an internal agent-platform scaffold, extended with custom autonomous workflow agents, Data Studio, and Strategic Planning modules for this hackathon.

---

© Built for Takeover hackthon NIAT.
