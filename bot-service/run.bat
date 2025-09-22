@echo off
call venv\Scripts\activate

if "%1"=="dev" (
    echo Starting FastAPI in development mode...
    uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
) else if "%1"=="prod" (
    echo Starting FastAPI in production mode...
    uvicorn app.main:app --host 0.0.0.0 --port 8000
) else (
    echo Usage: run.bat [dev|prod]
    exit /b 1
)
