# Python base image
FROM python:3.11

# Workdir set karo
WORKDIR /app

# Dependencies copy + install
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Code copy karo
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run command jo aap chahte ho
CMD ["./run.bat", "prod"]
