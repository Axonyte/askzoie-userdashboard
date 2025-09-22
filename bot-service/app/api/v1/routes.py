from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse

from app.services.rag_service import (
    build_user_store_from_pdf_bytes,
    add_pdf_to_user_store,
    retrieve,
    is_within_scope,
)

router = APIRouter(prefix="/rag", tags=["RAG"])


@router.post("/upload/{user_id}")
async def upload_pdf(user_id: str, file: UploadFile = File(...)):
    """
    Upload a PDF for a user, store embeddings in Pinecone
    """
    pdf_bytes = await file.read()
    try:
        result = add_pdf_to_user_store(user_id, pdf_bytes)
        return JSONResponse(content={"message": "PDF processed", "result": result})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@router.post("/query/{user_id}")
async def query(user_id: str, question: str = Form(...)):
    """
    Ask a question for a given user
    """
    try:
        results = retrieve(user_id, question, top_k=3)
        if is_within_scope(results):
            return JSONResponse(
                content={
                    "question": question,
                    "results": results,
                    "answer": results[0][0],  # returning top chunk as "answer"
                }
            )
        else:
            return JSONResponse(
                content={"question": question, "answer": "Out of my scope"}
            )
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
