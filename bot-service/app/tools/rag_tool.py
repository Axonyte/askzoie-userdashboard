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

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX)

def get_model() -> SentenceTransformer:
    """Lazy load the embedding model"""
    global _model
    if _model is None:
        _model = SentenceTransformer(EMBED_MODEL)
    return _model

def retrieve_chunks(bot_id: str, query: str, top_k: int = 3) -> List[Tuple[str, float]]:
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