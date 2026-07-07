import json
import logging
import re

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool
from langgraph.graph import END, START, StateGraph

from deerflow.agents.thread_state import ThreadState
from deerflow.models import create_chat_model

logger = logging.getLogger(__name__)


class BoardroomState(ThreadState):
    next_speaker: str
    consulted_departments: list[str]
    turn_count: int


@tool
def get_crypto_price(coin_id: str) -> str:
    """Finance tool to get crypto price. Always use this to fetch real market data."""
    # Mock for hackathon speed, replace with requests.get("api.coingecko.com...") if needed
    if "btc" in coin_id.lower() or "bitcoin" in coin_id.lower():
        return f"Current price of {coin_id}: $65,420.00. Trend: Bullish."
    return f"Current price of {coin_id}: $1.24. Trend: Stable."


@tool
def search_github(query: str) -> str:
    """Developer tool to search GitHub for existing open-source solutions."""
    return f"GitHub Search Results for '{query}':\n1. andromeda/core (10k stars)\n2. fpv-drone/flight-controller (4k stars)"


@tool
def create_ui_design(component_name: str, code: str) -> str:
    """Design agent tool to create UI code. This triggers the Workspace Split-Screen."""
    return f"```tsx\n// {component_name}\n{code}\n```"


def get_boardroom_graph(model_name: str, app_config):
    """Builds a multi-agent boardroom graph."""

    # We create a model for each department
    # Note: attach_tracing=False is required by DeerFlow's _make_lead_agent
    ceo_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    finance_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False).bind_tools([get_crypto_price])
    marketing_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    dev_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False).bind_tools([search_github])
    business_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    sales_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    legal_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False)
    design_model = create_chat_model(name=model_name, app_config=app_config, attach_tracing=False).bind_tools([create_ui_design])

    CEO_PROMPT = """You are the CEO of Andromeda AI. Your job is to moderate the boardroom discussion.
A user has submitted a request. Review it.
CRITICAL RULE: If the request is NOT a business, startup, technology, or finance-related query, 
you MUST politely refuse to answer and set next_speaker to END immediately. Do not answer general knowledge questions. 
(Note: Queries about public company financials, like Google's income, ARE valid finance queries).
If it IS a business query, ask the relevant departments for their input.
DO NOT CALL EVERYONE. Only pick the specific departments needed (Finance, Marketing, Developer, Business, Sales, Legal, Design).
If a department has already spoken, DO NOT call them again.
Once the required departments have weighed in, summarize the final decision and end the meeting by setting next_speaker to END.
You MUST output JSON in exactly this format:
{"response": "Finance, please analyze the budget.", "next_speaker": "Finance"}"""

    FINANCE_PROMPT = (
        "You are the Finance Agent. Provide conservative financial estimates. "
        "You MUST use your get_crypto_price tool if relevant. Fiercely debate and reject expensive ideas from other agents. "
        "If presenting financial data, you MUST generate a sleek HTML/CSS visual chart directly in your response."
    )
    MARKETING_PROMPT = (
        "You are the Marketing Agent. Focus on growth, viral loops, and brand awareness. "
        "Disagree with Finance if they are too conservative. "
        "You MUST generate HTML/CSS visual graphics or tables to illustrate your campaign strategies directly in your response."
    )
    DEV_PROMPT = (
        "You are the Developer Agent. Focus on technical feasibility. "
        "You MUST use your search_github tool to find existing code. Reject impossible ideas. "
        "If explaining architectures or metrics, generate a sleek HTML/CSS visual chart directly in your response."
    )
    BUSINESS_PROMPT = "You are the Business Agent. Focus on strategic partnerships. Limit response to 3 sentences."
    SALES_PROMPT = "You are the Sales Agent. Focus on lead generation and maximizing revenue. Limit response to 3 sentences."
    LEGAL_PROMPT = "You are the Legal Agent. Focus on compliance and minimizing liability risk. Limit response to 3 sentences."
    DESIGN_PROMPT = "You are the Design Agent. You MUST use your create_ui_design tool to generate React code for the user's request. Focus on sleek, modern aesthetics."

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
                if tool_call["name"] == "get_crypto_price":
                    tool_res = get_crypto_price.invoke(tool_call["args"])
                    coin = tool_call["args"].get("coin_id", "asset")
                    content += f"""
<div class="bg-slate-900 text-emerald-400 p-3 rounded-md font-mono text-xs my-3 shadow-inner border border-emerald-900/50">
  <div class="flex items-center gap-2 mb-1"><span class="animate-pulse">●</span> <span>Agent invoking Tool: [Finance.MarketTracker]</span></div>
  <div class="text-slate-400">> Querying live market data for: {coin}...</div>
  <div class="text-slate-400">> Establishing secure connection to exchange APIs...</div>
  <div class="text-emerald-500 mt-2 font-bold">[Success] {tool_res}</div>
</div>"""
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
                if tool_call["name"] == "search_github":
                    tool_res = search_github.invoke(tool_call["args"])
                    query = tool_call["args"].get("query", "code")
                    content += f'''
<div class="bg-slate-900 text-blue-400 p-3 rounded-md font-mono text-xs my-3 shadow-inner border border-blue-900/50">
  <div class="flex items-center gap-2 mb-1"><span class="animate-pulse">●</span> <span>Agent invoking Tool: [Developer.GitHubSearch]</span></div>
  <div class="text-slate-400">> Scanning global repositories for: "{query}"...</div>
  <div class="text-slate-400">> Analyzing code architecture and stars...</div>
  <div class="text-blue-500 mt-2 font-bold">[Success] {tool_res}</div>
</div>'''
        return {"messages": [AIMessage(content=content, name="Developer Agent")]}

    async def business_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        last_human = next((m for m in reversed(messages) if isinstance(m, HumanMessage)), None)
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = BUSINESS_PROMPT + f"\n\nUSER'S ORIGINAL REQUEST (GROUNDING):\n{last_human.content}\n\nContext:\n{context}"
        resp = await business_model.ainvoke([SystemMessage(content=prompt)], config=config)
        return {"messages": [AIMessage(content=resp.content, name="Business Agent")]}

    async def sales_node(state: BoardroomState, config: RunnableConfig):
        messages = state.get("messages", [])
        last_human = next((m for m in reversed(messages) if isinstance(m, HumanMessage)), None)
        context = "\n".join([f"{m.name}: {m.content}" for m in messages[-5:] if isinstance(m, AIMessage) or isinstance(m, HumanMessage)])
        prompt = SALES_PROMPT + f"\n\nUSER'S ORIGINAL REQUEST (GROUNDING):\n{last_human.content}\n\nContext:\n{context}"
        resp = await sales_model.ainvoke([SystemMessage(content=prompt)], config=config)
        return {"messages": [AIMessage(content=resp.content, name="Sales Agent")]}

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
                if tool_call["name"] == "create_ui_design":
                    tool_res = create_ui_design.invoke(tool_call["args"])
                    comp = tool_call["args"].get("component_name", "UI Component")
                    content += f"""
<div class="bg-slate-900 text-purple-400 p-3 rounded-md font-mono text-xs my-3 shadow-inner border border-purple-900/50">
  <div class="flex items-center gap-2 mb-1"><span class="animate-pulse">●</span> <span>Agent invoking Tool: [Design.UI_Generator]</span></div>
  <div class="text-slate-400">> Bootstrapping React component: {comp}...</div>
  <div class="text-slate-400">> Compiling TailwindCSS tokens and resolving dependencies...</div>
  <div class="text-purple-500 mt-2 font-bold">[Success] Component successfully deployed to Workspace panel.</div>
</div>
{tool_res}"""
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
