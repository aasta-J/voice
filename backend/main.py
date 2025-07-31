from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import os

app = FastAPI()

# 允許所有來源（實作中可加強限制）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 接收文字資料格式
class SpeechData(BaseModel):
    text: str

# 儲存資料的檔案
LOG_PATH = "logs/speech_logs.txt"
os.makedirs("logs", exist_ok=True)

@app.post("/save-speech/")
async def save_speech(data: SpeechData):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {data.text}\n")
    return {"message": "Speech saved successfully!"}
