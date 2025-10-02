import os
import io
import uuid
from typing import List, Optional

from sentence_transformers import SentenceTransformer
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec


load_dotenv()

EMBED_MODEL = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")
SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", 0.65))
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 500))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 50))

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "rag-index")

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
