from typing import List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.services.agent_service import generate_answer

from app.services.rag_service import (
    add_pdf_to_bot_store,
)

router = APIRouter(prefix="/rag", tags=["RAG"])


@router.post("/upload/{bot_id}")
async def upload_pdfs(bot_id: str, files: List[UploadFile] = File(...)):
    """
    Upload multiple PDFs for a bot, store embeddings in Pinecone
    """
    try:
        results = []
        for file in files:
            pdf_bytes = await file.read()
            result = add_pdf_to_bot_store(bot_id, pdf_bytes)
            results.append({"filename": file.filename, **result})
        return {"message": "PDFs processed", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/query/{bot_id}")
async def query(bot_id: str, question: str = Form(...)):
    """
    Ask a question for a given bot (retrieval + OpenAI answer) - returns JSON
    """
    try:
        answer = generate_answer(bot_id, question, top_k=3)

        return {
            "question": question,
            "answer": answer,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))