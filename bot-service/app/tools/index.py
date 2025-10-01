from .weather import weather

tools = [
    {
        "name": "weather",
        "description": "Fetch the current weather for a specific country",
        "func": lambda x: weather(x["country"])
    }
]
