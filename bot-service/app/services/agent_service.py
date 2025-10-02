import os
import re
from dotenv import load_dotenv 
from openai import OpenAI

from app.utils.agent_prompt import template 
from app.tools.index import tools

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  # NEW

# --- OpenAI client ---
client = OpenAI(api_key=OPENAI_API_KEY)  # NEW



def parse_llm_output(output: str):
    """
    Parse the LLM output into either an action or final answer.
    """
    action_match = re.search(r"Action:\s*(.+)\nAction Input:\s*(.+)", output, re.DOTALL)
    if action_match:
        return {
            "type": "action",
            "action": action_match.group(1).strip(),
            "input": action_match.group(2).strip()
        }

    final_match = re.search(r"Final Answer:\s*(.+)", output, re.DOTALL)
    if final_match:
        return {
            "type": "final",
            "answer": final_match.group(1).strip()
        }

    return {"type": "other", "raw": output}


def generate_answer(bot_id: str, query: str, top_k: int = 3) -> str:
    """
    Generate final answer with OpenAI, executing tools if requested.
    """
    scratchpad = ""

    tool_names = [t["name"] for t in tools]
    tool_descriptions = "\n".join([f"{t['name']}: {t['description']}" for t in tools])

    prompt = template.format(
        tools=tool_descriptions,
        tool_names=tool_names,
        chat_history="Human: hi i am hamza \nAI: Hello! How can I assist you today?",
        input=query,
        agent_scratchpad=scratchpad
    )

    while True:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful customer care bot."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
        )

        content = response.choices[0].message.content.strip()
        print("RAW LLM OUTPUT:\n", content, "\n")

        parsed = parse_llm_output(content)

        if parsed["type"] == "action":
            action = parsed["action"]
            action_input = parsed["input"]

            # lookup tool in tools list
            tool = next((t for t in tools if t["name"] == action), None)
            if tool:
                try:
                    # tool funcs expect dict input
                    observation = tool["func"](action_input)
                except Exception as e:
                    observation = f"Error while executing tool {action}: {e}"

                scratchpad += f"\n{content}\nObservation: {observation}\n"

                # update prompt with new scratchpad
                prompt = template.format(
                    tools=tool_descriptions,
                    tool_names=tool_names,
                    chat_history="Human: hi i am hamza \nAI: Hello! How can I assist you today?",
                    input=query,
                    agent_scratchpad=scratchpad
                )
                continue
            else:
                return f"Error: unknown tool {action}"

        elif parsed["type"] == "final":
            return parsed["answer"]

        else:
            return content
        
def get_agent_scratchpad(messages):
    """
    Extracts tool calls and tool outputs to form the agent_scratchpad.
    This is critical for ReAct to function properly.

    Args:
        messages: List of conversation messages

    Returns:
        List of AI and Tool messages for the scratchpad
    """
    scratchpad = []
    for msg in messages:
        scratchpad.append(msg)
    return scratchpad
