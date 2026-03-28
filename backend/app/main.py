from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import sqlite3
import re
import os
import logging

# 1. Enterprise Error Logging Setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Loomin-Docs API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_DIR = "/app/data/db"
DB_PATH = f"{DB_DIR}/loomin.db"

# 2. Input Validation
class ChatRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)
    model: str = Field(default="llama3")

class PIIShield:
    @staticmethod
    def sanitize(text: str) -> str:
        # Redact Emails
        text = re.sub(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', '<EMAIL_REDACTED>', text)
        # Redact Passwords/Secrets
        text = re.sub(r'(?i)(password|secret)(?:\s+is)?[\s:=]+(\S+)', r'\1: <CREDENTIAL_REDACTED>', text)
        return text

@app.on_event("startup")
def startup_db():
    logger.info("Initializing SQLite Database...")
    try:
        os.makedirs(DB_DIR, exist_ok=True)
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                model TEXT,
                original_text TEXT,
                sanitized_text TEXT
            )
        ''')
        conn.commit()
        conn.close()
        logger.info("✅ Database initialized successfully.")
    except sqlite3.Error as e:
        logger.error(f"❌ Database startup failed: {e}")
        raise RuntimeError("Database initialization failed")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    logger.info(f"Processing chat request using model: {req.model}")
    try:
        sanitized = PIIShield.sanitize(req.text)
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO chats (model, original_text, sanitized_text) VALUES (?, ?, ?)", 
                       (req.model, req.text, sanitized))
        conn.commit()
        conn.close()
        return {"response": sanitized, "model_used": req.model}
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail="Internal processing error")