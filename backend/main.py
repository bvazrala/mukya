"""
Mukya backend - a small FastAPI service that runs the AI prioritization locally.

Run it with:  uvicorn main:app --reload
It talks to Ollama (gemma4) on your own machine. No API keys; nothing leaves your computer.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import prioritize as p

app = FastAPI(title="Mukya")

# Let the Vite dev server call this during development. (If you use Vite's proxy,
# you won't even hit CORS - this is just a safety net for direct calls.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Task(BaseModel):
    id: str
    title: str
    deadline: str | None = None   # ISO date string, optional
    category: str | None = None


class Priority(BaseModel):
    rank: int
    label: str


class PrioritizeRequest(BaseModel):
    tasks: list[Task]
    priorities: list[Priority] = []
    categories: list[str] = []


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    priorities: list[Priority] = []


@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/prioritize")
def prioritize_route(req: PrioritizeRequest):
    results = p.prioritize(
        [t.model_dump() for t in req.tasks],
        [pr.model_dump() for pr in req.priorities],
        req.categories,
    )
    return {"results": results}


@app.post("/api/chat")
def chat_route(req: ChatRequest):
    reply = p.chat(
        [m.model_dump() for m in req.messages],
        [pr.model_dump() for pr in req.priorities],
    )
    return {"reply": reply}
