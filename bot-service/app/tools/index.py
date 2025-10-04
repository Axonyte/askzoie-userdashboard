from .weather import weather
from .rag_tool import retrieve_chunks

tools = [
    {
        "name": "weather",
        "description": "Fetch the current weather for a specific country",
        "func": lambda x: weather(x)
    },
    {
        "name": "rag_search",
        "description": "Retrieve the most relevant document chunks for a given query from the knowledge base",
        "func": lambda x: retrieve_chunks(x)
    },
]
