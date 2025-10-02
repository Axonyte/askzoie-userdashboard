from .weather import weather
from .rag_tool import rag_tool

tools = [
    {
        "name": "weather",
        "description": "Fetch the current weather for a specific country",
        "func": lambda x: weather(x)
    },
    {
        "name": "rag",
        "description": "Retrieve knowledge from uploaded PDFs using semantic search",
        "func": lambda x: rag_tool(x)
    }
]
