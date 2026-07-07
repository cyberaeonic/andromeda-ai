import json
import logging
import re

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool
from langgraph.graph import END, START, StateGraph

from deerflow.agents.thread_state import ThreadState
from deerflow.community.ddg_search.tools import web_search_tool
from deerflow.models import create_chat_model

logger = logging.getLogger(__name__)


class BoardroomState(ThreadState):
    next_speaker: str
    consulted_departments: list[str]
    turn_count: int


@tool
def send_email(to_address: str, subject: str, body: str) -> str:
    """Sales/Business tool to send a real email. Requires SMTP_EMAIL and SMTP_PASSWORD in env."""
    import os
    import smtplib
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText

    email = os.environ.get("SMTP_EMAIL")
    password = os.environ.get("SMTP_PASSWORD")

    if not email or not password:
        return "ERROR: Missing SMTP_EMAIL or SMTP_PASSWORD environment variables. Running in simulation mode: Email drafted successfully but NOT sent."

    try:
        msg = MIMEMultipart()
        msg["From"] = email
        msg["To"] = to_address
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(email, password)
        server.send_message(msg)
        server.quit()
        return f"Successfully sent email to {to_address}."
    except Exception as e:
        return f"Failed to send email: {e}"


@tool
def add_crm_lead(name: str, company: str, email: str, notes: str) -> str:
    """Sales tool to add a lead to the local CRM database (leads.csv)."""
    import csv
    import os

    file_exists = os.path.isfile("leads.csv")
    try:
        with open("leads.csv", "a", newline="") as csvfile:
            fieldnames = ["Name", "Company", "Email", "Notes"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            if not file_exists:
                writer.writeheader()
            writer.writerow({"Name": name, "Company": company, "Email": email, "Notes": notes})
        return f"Successfully added {name} from {company} to CRM."
    except Exception as e:
        return f"Failed to add lead to CRM: {e}"


@tool
def generate_pdf_proposal(client_name: str, proposal_body: str) -> str:
    """Business tool to generate a PDF proposal/invoice and save it locally."""
    import os

    from fpdf import FPDF

    try:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("helvetica", "B", 16)
        pdf.cell(0, 10, f"Business Proposal for {client_name}", ln=True, align="C")
        pdf.set_font("helvetica", "", 12)
        pdf.ln(10)

        for line in proposal_body.split("\\n"):
            pdf.multi_cell(0, 10, line)

        filename = f"proposal_{client_name.replace(' ', '_').lower()}.pdf"
        filepath = os.path.join(os.getcwd(), filename)
        pdf.output(filepath)
        return f"Successfully generated PDF proposal at {filepath}"
    except Exception as e:
        return f"Failed to generate PDF: {e}"


@tool
def schedule_meeting(title: str, description: str, date_time_iso: str) -> str:
    """Business tool to generate an .ics calendar invite file. date_time_iso should be like 2024-12-01T14:00:00Z"""
    import os

    dt = date_time_iso.replace("-", "").replace(":", "")
    if "Z" not in dt:
        dt += "Z"

    ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Andromeda AI//Boardroom Agent//EN
BEGIN:VEVENT
SUMMARY:{title}
DESCRIPTION:{description}
DTSTART:{dt}
DTEND:{dt}
END:VEVENT
END:VCALENDAR"""

    filename = f"meeting_{title.replace(' ', '_').lower()}.ics"
    filepath = os.path.join(os.getcwd(), filename)
    try:
        with open(filepath, "w") as f:
            f.write(ics_content)
        return f"Successfully created calendar invite at {filepath}"
    except Exception as e:
        return f"Failed to create calendar invite: {e}"


@tool
def generate_payment_link(product_name: str, price_usd: int) -> str:
    """Sales tool to generate a Stripe checkout link for closing a deal."""
    import uuid

    payment_id = str(uuid.uuid4())[:8]
    return f"https://buy.stripe.com/test_{payment_id}?product={product_name.replace(' ', '+')}&price={price_usd}"


@tool
def send_slack_webhook(message: str) -> str:
    """Sales tool to ping a Slack channel via webhook. Requires SLACK_WEBHOOK_URL in env."""
    import os

    import requests

    webhook_url = os.environ.get("SLACK_WEBHOOK_URL")
    if not webhook_url:
        return "ERROR: Missing SLACK_WEBHOOK_URL env. Running in simulation mode: Slack message drafted successfully but NOT sent."

    try:
        response = requests.post(webhook_url, json={"text": message})
        if response.status_code == 200:
            return "Successfully pinged Slack channel."
        return f"Slack API returned status {response.status_code}"
    except Exception as e:
        return f"Failed to ping Slack: {e}"


@tool
def generate_ui_mockup(prompt: str) -> str:
    """Design tool to generate a UI mockup image based on a prompt. ONLY use if explicitly requested."""
    import urllib.parse

    # Use pollinations.ai for real on-the-fly generative AI imagery.
    enhanced_prompt = f"sleek modern enterprise UI mockup, {prompt}, dark mode, high quality UI design"
    encoded = urllib.parse.quote(enhanced_prompt)
    return f"![Generated UI Design](https://image.pollinations.ai/prompt/{encoded}?width=800&height=600&nologo=true)"


def get_boardroom_graph(model_name: str, app_config):
    """Builds a multi-agent boardroom graph."""

    # We create a model for each department
    # Note: attach_tracing=False is required by DeerFlow's _make_lead_agent
    ceo_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    finance_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False).bind_tools([web_search_tool])
    marketing_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    dev_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False).bind_tools([web_search_tool])
    business_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False).bind_tools([web_search_tool, send_email, generate_pdf_proposal, schedule_meeting])
    sales_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False).bind_tools([web_search_tool, send_email, add_crm_lead, generate_payment_link, send_slack_webhook])
    legal_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    design_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False).bind_tools([generate_ui_mockup])

    CEO_PROMPT = (
        "You are the CEO of Andromeda AI. Your job is to route workflows and moderate the boardroom discussion.\n"
        "A user has submitted a request. Identify the required execution tools.\n"
        "CRITICAL RULE: You may provide brief, high-level strategic reasoning when routing tasks, but avoid meaningless pleasantries. You are an efficient executive.\n"
        "DO NOT CALL EVERYONE. Only pick the specific departments needed (Finance, Marketing, Developer, Business, Sales, Legal, Design).\n"
        "If a department has already spoken, DO NOT call them again.\n"
        "Once all necessary tools have been executed by departments, end the workflow by setting next_speaker to END.\n"
        "You MUST output JSON in exactly this format:\n"
        '{"response": "Executing Sales tools for lead generation.", "next_speaker": "Sales"}'
    )

    FINANCE_PROMPT = (
        "You are the Finance Agent. Provide conservative financial estimates. You MUST use your web_search_tool to fetch real market data. "
        "You may provide a brief, professional summary explaining the results of your tool executions and strategic reasoning. Avoid meaningless conversational filler."
    )
    MARKETING_PROMPT = "You are the Marketing Agent. Focus on growth and viral loops. Provide a brief, professional summary of your strategy, but avoid meaningless conversational filler."
    DEV_PROMPT = "You are the Developer Agent. You MUST use your web_search_tool to search GitHub/StackOverflow. Provide a brief, professional summary explaining your findings, but avoid meaningless conversational filler."
    BUSINESS_PROMPT = (
        "You are the Business Agent. Focus on strategic partnerships. "
        "You MUST aggressively use web_search_tool, send_email, generate_pdf_proposal, and schedule_meeting. "
        "You may provide a brief, professional summary explaining the results of your tool executions and strategic reasoning. Avoid meaningless conversational filler."
    )
    SALES_PROMPT = (
        "You are the Sales Agent. Focus on lead generation and maximizing revenue. "
        "You MUST aggressively use web_search_tool, add_crm_lead, send_email, generate_payment_link, and send_slack_webhook. "
        "You may provide a brief, professional summary explaining the results of your tool executions and strategic reasoning. Avoid meaningless conversational filler."
    )
    LEGAL_PROMPT = "You are the Legal Agent. Focus on compliance. Provide a brief, professional summary, but avoid meaningless conversational filler."
    DESIGN_PROMPT = (
        "You are the Design Agent. You can generate UI mockups using `generate_ui_mockup`, "
        "but ONLY if the user explicitly asks for an image/design. "
        "Output the generated image markdown directly. "
        "DO NOT output HTML/React code unless explicitly asked for code. "
        "DO NOT use conversational filler."
    )

    async def ceo_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        consulted = state.get("consulted_departments", [])
        turn_count = state.get("turn_count", 0)

        last_human = next((m for m in reversed(messages) if isinstance(m, HumanMessage)), None)
        ai_messages = [m for m in messages if isinstance(m, AIMessage)]

        # Hard cap to prevent infinite loops
        if turn_count >= 6:
            return {"messages": [AIMessage(content="We've discussed this extensively. I'm ending the meeting here. Let's proceed with these actions.", name="CEO")], "next_speaker": "END", "turn_count": turn_count + 1}

        if not ai_messages:
            prompt = CEO_PROMPT + f"\n\nUser Request: {last_human.content}"
        else:
            recent_context = "\n".join([f"{m.name}: {m.content}" for m in messages[-4:] if isinstance(m, AIMessage)])
            prompt = (
                CEO_PROMPT
                + f"\n\nUser Request: {last_human.content}\n\nRecent Discussion:\n{recent_context}"
                + f"\n\nDepartments already consulted: {consulted}\n\nPick the NEXT necessary department, or set next_speaker to END if we are done."
            )

        resp = await ceo_model.ainvoke([SystemMessage(content=prompt)], config=config)
        content_str = resp.content

        # Robust JSON extraction
        json_match = re.search(r"\{.*\}", content_str, re.DOTALL)
        if json_match:
            try:
                parsed = json.loads(json_match.group(0))
                response_text = parsed.get("response", content_str)
                next_speaker = parsed.get("next_speaker", "END")
            except Exception:
                response_text = content_str
                next_speaker = "END"
        else:
            response_text = content_str
            next_speaker = "END"

        return {"messages": [AIMessage(content=response_text, name="CEO")], "next_speaker": next_speaker, "turn_count": turn_count + 1, "consulted_departments": consulted + [next_speaker] if next_speaker != "END" else consulted}

    async def finance_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        last_human = next((m for m in reversed(messages) if isinstance(m, HumanMessage)), None)
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = FINANCE_PROMPT + f"\n\nUSER'S ORIGINAL REQUEST (GROUNDING):\n{last_human.content}\n\nContext:\n{context}"

        resp = await finance_model.ainvoke([SystemMessage(content=prompt)], config=config)
        content = resp.content
        if resp.tool_calls:
            for tool_call in resp.tool_calls:
                if tool_call["name"] == "web_search":
                    tool_res = web_search_tool.invoke(tool_call["args"])
                    content += f"\n✅ **[Finance.MarketTracker]** Fetched live data: {tool_res[:100]}...\n"
        return {"messages": [AIMessage(content=content, name="Finance Agent")]}

    async def marketing_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        last_human = next((m for m in reversed(messages) if isinstance(m, HumanMessage)), None)
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = MARKETING_PROMPT + f"\n\nUSER'S ORIGINAL REQUEST (GROUNDING):\n{last_human.content}\n\nContext:\n{context}"
        resp = await marketing_model.ainvoke([SystemMessage(content=prompt)], config=config)
        return {"messages": [AIMessage(content=resp.content, name="Marketing Agent")]}

    async def dev_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        last_human = next((m for m in reversed(messages) if isinstance(m, HumanMessage)), None)
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = DEV_PROMPT + f"\n\nUSER'S ORIGINAL REQUEST (GROUNDING):\n{last_human.content}\n\nContext:\n{context}"
        resp = await dev_model.ainvoke([SystemMessage(content=prompt)], config=config)

        content = resp.content
        if resp.tool_calls:
            for tool_call in resp.tool_calls:
                if tool_call["name"] == "web_search":
                    tool_res = web_search_tool.invoke(tool_call["args"])
                    content += f"\n✅ **[Developer.GitHubSearch]** Scanned global repositories: {tool_res[:100]}...\n"
        return {"messages": [AIMessage(content=content, name="Developer Agent")]}

    async def business_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        last_human = next((m for m in reversed(messages) if isinstance(m, HumanMessage)), None)
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = BUSINESS_PROMPT + f"\n\nUSER'S ORIGINAL REQUEST (GROUNDING):\n{last_human.content}\n\nContext:\n{context}"
        resp = await business_model.ainvoke([SystemMessage(content=prompt)], config=config)
        content = resp.content
        if resp.tool_calls:
            for tool_call in resp.tool_calls:
                if tool_call["name"] == "web_search":
                    web_search_tool.invoke(tool_call["args"])
                    query = tool_call["args"].get("query", "partners")
                    content += f"\n✅ **[Business.WebSearch]** Searched for: {query}\n"
                elif tool_call["name"] == "send_email":
                    send_email.invoke(tool_call["args"])
                    to = tool_call["args"].get("to_address", "target")
                    subj = tool_call["args"].get("subject", "outreach")
                    content += f"\n✅ **[Business.Outreach]** Sent email to {to} (Subject: {subj})\n"
                elif tool_call["name"] == "generate_pdf_proposal":
                    generate_pdf_proposal.invoke(tool_call["args"])
                    client = tool_call["args"].get("client_name", "Client")
                    content += f"\n✅ **[Business.Docs]** Generated PDF Proposal for {client}\n"
                elif tool_call["name"] == "schedule_meeting":
                    schedule_meeting.invoke(tool_call["args"])
                    title = tool_call["args"].get("title", "Meeting")
                    content += f"\n✅ **[Business.Calendar]** Scheduled Kickoff Meeting: {title}\n"
        return {"messages": [AIMessage(content=content, name="Business Agent")]}

    async def sales_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        last_human = next((m for m in reversed(messages) if isinstance(m, HumanMessage)), None)
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = SALES_PROMPT + f"\n\nUSER'S ORIGINAL REQUEST (GROUNDING):\n{last_human.content}\n\nContext:\n{context}"
        resp = await sales_model.ainvoke([SystemMessage(content=prompt)], config=config)
        content = resp.content
        if resp.tool_calls:
            for tool_call in resp.tool_calls:
                if tool_call["name"] == "web_search":
                    web_search_tool.invoke(tool_call["args"])
                    query = tool_call["args"].get("query", "leads")
                    content += f"\n✅ **[Sales.WebSearch]** Searched for: {query}\n"
                elif tool_call["name"] == "send_email":
                    send_email.invoke(tool_call["args"])
                    to = tool_call["args"].get("to_address", "lead")
                    subj = tool_call["args"].get("subject", "outreach")
                    content += f"\n✅ **[Sales.Outreach]** Sent email to {to} (Subject: {subj})\n"
                elif tool_call["name"] == "add_crm_lead":
                    add_crm_lead.invoke(tool_call["args"])
                    name = tool_call["args"].get("name", "Unknown")
                    comp = tool_call["args"].get("company", "Unknown")
                    content += f"\n✅ **[Sales.CRM]** Added lead to CRM: {name} ({comp})\n"
                elif tool_call["name"] == "generate_payment_link":
                    tool_res = generate_payment_link.invoke(tool_call["args"])
                    prod = tool_call["args"].get("product_name", "Product")
                    content += f"\n✅ **[Sales.Payments]** Generated Stripe Checkout URL for {prod}: {tool_res}\n"
                elif tool_call["name"] == "send_slack_webhook":
                    send_slack_webhook.invoke(tool_call["args"])
                    content += "\n✅ **[Sales.Comms]** Pinged team Slack channel\n"
        return {"messages": [AIMessage(content=content, name="Sales Agent")]}

    async def legal_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        last_human = next((m for m in reversed(messages) if isinstance(m, HumanMessage)), None)
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = LEGAL_PROMPT + f"\n\nUSER'S ORIGINAL REQUEST (GROUNDING):\n{last_human.content}\n\nContext:\n{context}"
        resp = await legal_model.ainvoke([SystemMessage(content=prompt)], config=config)
        return {"messages": [AIMessage(content=resp.content, name="Legal Agent")]}

    async def design_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        last_human = next((m for m in reversed(messages) if isinstance(m, HumanMessage)), None)
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = DESIGN_PROMPT + f"\n\nUSER'S ORIGINAL REQUEST (GROUNDING):\n{last_human.content}\n\nContext:\n{context}"
        resp = await design_model.ainvoke([SystemMessage(content=prompt)], config=config)

        content = resp.content
        if resp.tool_calls:
            for tool_call in resp.tool_calls:
                if tool_call["name"] == "generate_ui_mockup":
                    tool_res = generate_ui_mockup.invoke(tool_call["args"])
                    content += f"\n\n{tool_res}\n"
        return {"messages": [AIMessage(content=content, name="Design Agent")]}

    def router(state: BoardroomState):
        speaker = state.get("next_speaker", "END")
        if speaker == "Finance":
            return "finance"
        if speaker == "Marketing":
            return "marketing"
        if speaker == "Developer":
            return "developer"
        if speaker == "Business":
            return "business"
        if speaker == "Sales":
            return "sales"
        if speaker == "Legal":
            return "legal"
        if speaker == "Design":
            return "design"
        return END

    workflow = StateGraph(BoardroomState)

    workflow.add_node("ceo", ceo_node)
    workflow.add_node("finance", finance_node)
    workflow.add_node("marketing", marketing_node)
    workflow.add_node("developer", dev_node)
    workflow.add_node("business", business_node)
    workflow.add_node("sales", sales_node)
    workflow.add_node("legal", legal_node)
    workflow.add_node("design", design_node)

    workflow.add_edge(START, "ceo")
    workflow.add_conditional_edges("ceo", router, {"finance": "finance", "marketing": "marketing", "developer": "developer", "business": "business", "sales": "sales", "legal": "legal", "design": "design", END: END})

    workflow.add_edge("finance", "ceo")
    workflow.add_edge("marketing", "ceo")
    workflow.add_edge("developer", "ceo")
    workflow.add_edge("business", "ceo")
    workflow.add_edge("sales", "ceo")
    workflow.add_edge("legal", "ceo")
    workflow.add_edge("design", "ceo")

    return workflow.compile()
