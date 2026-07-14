import asyncio
import os

os.environ["OPENAI_API_KEY"] = "sk-PHrZLnGyyG8fLHrJ9RmagMC0pI4vDApq9i4kkTmK6n7TuO0MuF7sWf6XBgb4zbOL"

from app.gateway.boardroom import get_boardroom_graph
from deerflow.config import app_config


async def test():
    graph = get_boardroom_graph("openai:gpt-4o", app_config)
    state = {"messages": [("user", "Hello, do some marketing")], "consulted_departments": [], "turn_count": 0}
    try:
        async for s in graph.astream(state):
            print(s)
    except Exception as e:
        print("ERROR:", e)


if __name__ == "__main__":
    asyncio.run(test())
