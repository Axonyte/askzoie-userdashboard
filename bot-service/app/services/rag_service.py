import os
import io
import uuid
from typing import List, Tuple, Optional

import html
from sentence_transformers import SentenceTransformer
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI  # NEW

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


def retrieve(bot_id: str, query: str, top_k: int = 3) -> List[Tuple[str, float]]:
    model = get_model()
    q_emb = model.encode([query], convert_to_numpy=True)[0]

    res = index.query(
        vector=q_emb.tolist(),
        top_k=top_k,
        filter={"bot_id": {"$eq": bot_id}},
        include_metadata=True,
    )

    results = []
    for match in res["matches"]:
        results.append((match["metadata"]["chunk"], float(match["score"])))
    return results


def is_within_scope(ranked: List[Tuple[str, float]], threshold: float = SIMILARITY_THRESHOLD) -> bool:
    if not ranked:
        return False
    top_sim = ranked[0][1]
    return top_sim >= threshold


# --- NEW FUNCTION ---
def generate_answer(bot_id: str, query: str, top_k: int = 3, strict_mode: bool = True) -> str:
    """
    Retrieve chunks and generate final answer with OpenAI.
    
    - strict_mode=True  → Bot will ONLY answer using provided PDF context.
    - strict_mode=False → Bot can also use general knowledge if context is missing.
    """
    ranked = retrieve(bot_id, query, top_k=top_k)

    if not ranked:
        if strict_mode:
            return "I’m sorry, but I couldn’t find any information about that in the documents you provided."
        else:
            # fallback: let model use general knowledge
            prompt = f"""
You are a polite and professional customer support assistant.
Answer the customer’s question even if there is no provided context.
Customer question: {query}
Answer:
"""
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
            )
            try:
                return response.choices[0].message.content.strip()
            except Exception:
                return "I’m sorry, I couldn’t process your request at the moment. Please try again later."

    # if chunks found
    context = "\n\n".join([chunk for chunk, score in ranked])

    if strict_mode:
        prompt = f"""
You are a polite and professional customer support assistant.
You must ONLY answer based on the provided context. 
If the context does not contain enough information to answer the question, 
politely say you don’t have that information.

Context (knowledge base):
{context}

Customer question: {query}

Answer:
"""
    else:
        prompt = f"""
You are a helpful customer support assistant.
Prefer to answer based on the provided context, but you may also use your general knowledge 
if the context does not have enough information.

Context (knowledge base):
{context}

Customer question: {query}

Answer:
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful customer care bot."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
    )

    try:
        return response.choices[0].message.content.strip()
    except Exception:
        return "I’m sorry, I couldn’t process your request at the moment. Please try again later."
