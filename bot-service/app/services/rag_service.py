import os
import io
import uuid
from typing import List, Tuple, Optional
import re


import html
from sentence_transformers import SentenceTransformer
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI

from app.utils.agent_prompt import template 
from app.tools.index import tools

load_dotenv()

EMBED_MODEL = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")
SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", 0.65))
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 500))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 50))

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "rag-index")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  # NEW

# initialize model (lazy loaded)
_model: Optional[SentenceTransformer] = None


def get_model() -> SentenceTransformer:
    """Lazy load the embedding model"""
    global _model
    if _model is None:
        _model = SentenceTransformer(EMBED_MODEL)
    return _model


# --- Pinecone setup ---
pc = Pinecone(api_key=PINECONE_API_KEY)

if PINECONE_INDEX not in [i["name"] for i in pc.list_indexes()]:
    pc.create_index(
        name=PINECONE_INDEX,
        dimension=384,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )

index = pc.Index(PINECONE_INDEX)

# --- OpenAI client ---
client = OpenAI(api_key=OPENAI_API_KEY)  # NEW


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(pdf_bytes))
    texts = []
    for page in reader.pages:
        try:
            txt = page.extract_text()
        except Exception:
            txt = ""
        if txt:
            texts.append(txt)
    return "\n".join(texts)


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    text = text.replace("\r\n", "\n")
    tokens = text.split()
    chunks = []
    i = 0
    while i < len(tokens):
        chunk_tokens = tokens[i:i + chunk_size]
        chunks.append(" ".join(chunk_tokens))
        i += chunk_size - overlap
    return chunks


def build_bot_store_from_pdf_bytes(bot_id: str, pdf_bytes: bytes):
    text = extract_text_from_pdf_bytes(pdf_bytes)
    chunks = chunk_text(text)

    if not chunks:
        return {"bot_id": bot_id, "chunks": 0}

    model = get_model()
    embeddings = model.encode(chunks, show_progress_bar=False, convert_to_numpy=True)

    doc_id = str(uuid.uuid4())

    vectors = []
    for i, emb in enumerate(embeddings):
        vectors.append({
            "id": f"{bot_id}-{doc_id}-{i}",
            "values": emb.tolist(),
            "metadata": {
                "bot_id": bot_id,
                "doc_id": doc_id,
                "chunk": chunks[i]
            },
        })
    index.upsert(vectors=vectors)
    return {"bot_id": bot_id, "doc_id": doc_id, "chunks": len(chunks)}


def add_pdf_to_bot_store(bot_id: str, pdf_bytes: bytes):
    return build_bot_store_from_pdf_bytes(bot_id, pdf_bytes)


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
