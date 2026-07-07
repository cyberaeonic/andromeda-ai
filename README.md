# Andromeda AI 🌌

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

## Vision / Roadmap: The AI Executive Team

Beyond single-agent workflows, Andromeda is being built toward a full **multi-agent executive team**: a CEO agent that moderates discussion between Finance, Marketing, Operations, and Developer agents — each with distinct priorities — before presenting a synthesized, human-approved decision. This is in active development; the current release focuses on the autonomous research/analysis workflows above as the proven foundation.

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

© 2025 Cyberaeonic. Built for [HACKATHON NAME HERE].
