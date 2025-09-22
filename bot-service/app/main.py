from fastapi import FastAPI
from app.api.v1 import routes

app = FastAPI(title="FastAPI Project")

# include routes
app.include_router(routes.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "FastAPI project health check!"}
