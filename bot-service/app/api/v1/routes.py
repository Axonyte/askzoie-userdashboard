from typing import List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.services.rag_service import (
    add_pdf_to_bot_store,
    retrieve,
    is_within_scope,
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
    Ask a question for a given bot
    """
    try:
        results = retrieve(bot_id, question, top_k=3)

        if not results:
            return {"question": question, "answer": "No results found"}

        if is_within_scope(results):
            answer = results[0][0] if results[0] else "No answer available"
            return {"question": question, "results": results, "answer": answer}
        else:
            return {"question": question, "answer": "Out of my scope"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
