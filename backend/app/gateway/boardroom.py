import json
import logging

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import END, START, StateGraph

from deerflow.agents.thread_state import ThreadState
from deerflow.models import create_chat_model

logger = logging.getLogger(__name__)


class BoardroomState(ThreadState):
    next_speaker: str


# Mock business tools for the hackathon
def calculate_profit_margin(revenue: float, costs: float) -> str:
    """Finance tool to calculate profit margin."""
    if revenue <= 0:
        return "Revenue must be positive."
    margin = ((revenue - costs) / revenue) * 100
    return f"Profit Margin: {margin:.2f}%"


def launch_marketing_campaign(platform: str, budget: float) -> str:
    """Marketing tool to launch a campaign."""
    return f"Campaign launched on {platform} with a budget of ${budget:,.2f}. Estimated reach: {int(budget * 1.5)} users."


def commit_code_changes(repo: str, message: str) -> str:
    """Developer tool to commit code."""
    return f"Code committed to {repo} with message: '{message}'."


def get_boardroom_graph(model_name: str, app_config):
    """Builds a multi-agent boardroom graph."""

    # We create a model for each department
    # Note: attach_tracing=False is required by DeerFlow's _make_lead_agent
    ceo_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    finance_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    marketing_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    dev_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    business_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    sales_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    legal_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)

    CEO_PROMPT = """You are the CEO of Andromeda AI. Your job is to moderate the boardroom discussion.
A user has submitted a request. Review it, and ask the relevant departments (Finance, Marketing, Developer, Business, Sales, Legal) for their input.
Once all departments have weighed in, summarize the final decision and end the meeting.
You MUST output JSON with a 'next_speaker' key indicating who should speak next (Finance, Marketing, Developer, Business, Sales, Legal, or END if the meeting is over).
Example: {"response": "Finance, please analyze the budget.", "next_speaker": "Finance"}"""

    FINANCE_PROMPT = "You are the Finance Agent. Always provide conservative financial estimates and focus on ROI. Limit response to 3 sentences."
    MARKETING_PROMPT = "You are the Marketing Agent. Always focus on growth, viral loops, and brand awareness. Limit response to 3 sentences."
    DEV_PROMPT = "You are the Developer Agent. Always focus on technical feasibility and architecture. Limit response to 3 sentences."
    BUSINESS_PROMPT = "You are the Business Agent. Always focus on strategic partnerships and splitting work efficiently. Limit response to 3 sentences."
    SALES_PROMPT = "You are the Sales Agent. Always focus on lead generation, closing deals, and maximizing revenue. Limit response to 3 sentences."
    LEGAL_PROMPT = "You are the Legal Agent. Always focus on compliance, terms of service, and minimizing liability risk. Limit response to 3 sentences."

    async def ceo_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        # Find the last human message
        last_human = next((m for m in reversed(messages) if isinstance(m, HumanMessage)), None)

        # If this is the first turn (no AI messages yet), start the meeting
        ai_messages = [m for m in messages if isinstance(m, AIMessage)]
        if not ai_messages:
            prompt = CEO_PROMPT + f"\n\nUser Request: {last_human.content}"
        else:
            # Continue the meeting
            recent_context = "\n".join([f"{m.name}: {m.content}" for m in messages[-3:] if isinstance(m, AIMessage)])
            prompt = CEO_PROMPT + f"\n\nRecent Discussion:\n{recent_context}\n\nWhat is your next move?"

        resp = await ceo_model.ainvoke([SystemMessage(content=prompt)], config=config)

        try:
            # Parse the JSON response
            content_str = resp.content
            if "```json" in content_str:
                content_str = content_str.split("```json")[1].split("```")[0]
            parsed = json.loads(content_str)
            response_text = parsed.get("response", resp.content)
            next_speaker = parsed.get("next_speaker", "END")
        except Exception:
            response_text = resp.content
            next_speaker = "END"  # Fallback

        return {"messages": [AIMessage(content=response_text, name="CEO")], "next_speaker": next_speaker}

    async def finance_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = FINANCE_PROMPT + f"\n\nContext:\n{context}"
        resp = await finance_model.ainvoke([SystemMessage(content=prompt)], config=config)
        return {"messages": [AIMessage(content=resp.content, name="Finance Agent")]}

    async def marketing_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = MARKETING_PROMPT + f"\n\nContext:\n{context}"
        resp = await marketing_model.ainvoke([SystemMessage(content=prompt)], config=config)
        return {"messages": [AIMessage(content=resp.content, name="Marketing Agent")]}

    async def dev_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = DEV_PROMPT + f"\n\nContext:\n{context}"
        resp = await dev_model.ainvoke([SystemMessage(content=prompt)], config=config)
        return {"messages": [AIMessage(content=resp.content, name="Developer Agent")]}

    async def business_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = BUSINESS_PROMPT + f"\n\nContext:\n{context}"
        resp = await business_model.ainvoke([SystemMessage(content=prompt)], config=config)
        return {"messages": [AIMessage(content=resp.content, name="Business Agent")]}

    async def sales_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = SALES_PROMPT + f"\n\nContext:\n{context}"
        resp = await sales_model.ainvoke([SystemMessage(content=prompt)], config=config)
        return {"messages": [AIMessage(content=resp.content, name="Sales Agent")]}

    async def legal_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = LEGAL_PROMPT + f"\n\nContext:\n{context}"
        resp = await legal_model.ainvoke([SystemMessage(content=prompt)], config=config)
        return {"messages": [AIMessage(content=resp.content, name="Legal Agent")]}

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
        return END

    workflow = StateGraph(BoardroomState)

    workflow.add_node("ceo", ceo_node)
    workflow.add_node("finance", finance_node)
    workflow.add_node("marketing", marketing_node)
    workflow.add_node("developer", dev_node)
    workflow.add_node("business", business_node)
    workflow.add_node("sales", sales_node)
    workflow.add_node("legal", legal_node)

    workflow.add_edge(START, "ceo")
    workflow.add_conditional_edges("ceo", router, {"finance": "finance", "marketing": "marketing", "developer": "developer", "business": "business", "sales": "sales", "legal": "legal", END: END})

    workflow.add_edge("finance", "ceo")
    workflow.add_edge("marketing", "ceo")
    workflow.add_edge("developer", "ceo")
    workflow.add_edge("business", "ceo")
    workflow.add_edge("sales", "ceo")
    workflow.add_edge("legal", "ceo")

    return workflow.compile()
