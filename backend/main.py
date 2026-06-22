from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import prioritize

app = FastAPI(title="Mukya")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Item(BaseModel):
    id: str
    title: str
    type: str = "task"
    category: str | None = None


class Priority(BaseModel):
    rank: int
    label: str


class Goal(BaseModel):
    id: str
    text: str


class Persona(BaseModel):
    priorities: list[Priority] = []
    goals: list[Goal] = []


class ClassifyRequest(BaseModel):
    items: list[Item]
    persona: Persona = Persona()


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    persona: Persona = Persona()


@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/classify")
def classify(req: ClassifyRequest):
    items = [i.model_dump() for i in req.items]
    return {"results": prioritize.classify(items, req.persona.model_dump())}


@app.post("/api/chat")
def chat(req: ChatRequest):
    messages = [m.model_dump() for m in req.messages]
    return {"reply": prioritize.chat(messages, req.persona.model_dump())}
