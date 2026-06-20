"""
Mukya - prioritization logic.

The accuracy strategy (this is the important part):
  1. URGENCY is computed in code from each task's deadline. The AI never does
     date math (LLMs are unreliable at it). Deterministic = accurate.
  2. IMPORTANCE is judged by the AI, but *grounded* in the user's own ranked
     priorities. The model isn't inventing what matters - it's mapping each
     task onto priorities the user already declared.
  3. The Eisenhower QUADRANT is then assigned in code from (importance, urgency).
     Same inputs always produce the same quadrant.

So the only thing the model decides is an importance score, with the user's
ranking as the rubric. Everything else is deterministic.

Tunables are the three constants right below.
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone

import ollama

# Set MUKYA_MODEL=gemma4:e4b on lighter machines (under ~16GB RAM).
MODEL = os.getenv("MUKYA_MODEL", "gemma4:12b")
URGENT_WINDOW_HOURS = 48   # a task due within this many hours (or overdue) is "urgent"
IMPORTANT_THRESHOLD = 6    # importance >= this (on 1-10) counts as "important"


def _is_urgent(deadline_iso: str | None) -> bool:
    """Deterministic urgency from a deadline. No deadline = not urgent."""
    if not deadline_iso:
        return False
    try:
        deadline = datetime.fromisoformat(deadline_iso.replace("Z", "+00:00"))
    except ValueError:
        return False
    if deadline.tzinfo is None:
        deadline = deadline.replace(tzinfo=timezone.utc)
    hours_left = (deadline - datetime.now(timezone.utc)).total_seconds() / 3600
    return hours_left <= URGENT_WINDOW_HOURS  # overdue (negative) or due soon


def _quadrant(important: bool, urgent: bool) -> str:
    if important and urgent:
        return "do"          # do it now
    if important and not urgent:
        return "schedule"    # decide / schedule a time to do it later
    if not important and urgent:
        return "delegate"    # can someone else do it?
    return "delete"          # eliminate it


def _build_messages(tasks: list[dict], priorities: list[dict], categories: list[str]) -> list[dict]:
    # The user's ranking IS the rubric. Lower rank number = more important.
    ranking = sorted(priorities, key=lambda x: x.get("rank", 999))
    ranking_text = "\n".join(f'  - rank {p.get("rank")}: {p.get("label")}' for p in ranking) or "  (none)"
    categories_text = ", ".join(categories) if categories else "(none)"
    tasks_text = "\n".join(
        f'  - id={t["id"]}: "{t["title"]}" (category: {t.get("category") or "none"})' for t in tasks
    )

    system = (
        "You rate how IMPORTANT each task is to THIS user, using ONLY the user's own "
        "ranked priorities as your rubric. Lower rank number means more important; equal "
        "ranks mean equally important. A task that clearly serves a top-ranked priority is "
        "important (8-10). A task serving a low-ranked or unlisted priority is less important "
        "(1-4). Ignore deadlines and urgency entirely - judge importance only. "
        "Respond with ONLY a JSON object in exactly this shape, no prose:\n"
        '{"items": [{"id": "<task id>", "importance": <integer 1-10>, "reason": "<short phrase>"}]}'
    )
    user = (
        f"User's ranked priorities:\n{ranking_text}\n\n"
        f"User's categories: {categories_text}\n\n"
        f"Tasks to rate:\n{tasks_text}"
    )
    return [{"role": "system", "content": system}, {"role": "user", "content": user}]


def _ask_model(messages: list[dict]) -> dict:
    """Call Ollama and parse JSON, retrying once if the first parse fails."""
    for _ in range(2):
        resp = ollama.chat(
            model=MODEL,
            messages=messages,
            format="json",                 # ask Ollama to constrain output to JSON
            options={"temperature": 0.1},  # low temp = repeatable, accurate-feeling results
        )
        content = resp["message"]["content"].strip()
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            messages = messages + [
                {"role": "assistant", "content": content},
                {"role": "user", "content": "That was not valid JSON. Return ONLY the JSON object."},
            ]
    return {"items": []}


def prioritize(tasks: list[dict], priorities: list[dict], categories: list[str]) -> list[dict]:
    """
    tasks:      [{id, title, deadline?(ISO string), category?}]
    priorities: [{rank, label}]   (ties allowed: two items may share a rank)
    categories: [str]
    returns:    [{id, title, quadrant, importance, urgent, reason}]
    """
    if not tasks:
        return []

    # 1. AI importance, grounded in the user's ranking.
    scored: dict[str, tuple[int, str]] = {}
    try:
        result = _ask_model(_build_messages(tasks, priorities, categories))
        for item in result.get("items", []):
            scored[str(item.get("id"))] = (int(item.get("importance", 5)), str(item.get("reason", "")))
    except Exception as e:
        # If Ollama is unreachable, fall back to neutral importance so the UI still works.
        print(f"[prioritize] model call failed: {e}")

    # 2. Deterministic urgency + quadrant.
    out = []
    for t in tasks:
        importance, reason = scored.get(str(t["id"]), (5, "not scored"))
        urgent = _is_urgent(t.get("deadline"))
        important = importance >= IMPORTANT_THRESHOLD
        out.append({
            "id": t["id"],
            "title": t["title"],
            "quadrant": _quadrant(important, urgent),
            "importance": importance,
            "urgent": urgent,
            "reason": reason,
        })
    return out


def chat(messages: list[dict], priorities: list[dict]) -> str:
    """Conversational 'help me think through my priorities' endpoint."""
    ranking = sorted(priorities, key=lambda x: x.get("rank", 999))
    ranking_text = "\n".join(f'  - rank {p.get("rank")}: {p.get("label")}' for p in ranking) or "(none yet)"
    system = (
        "You are a thoughtful planning coach helping the user clarify their priorities. "
        "Be concise and practical, and ask one focused question at a time when it helps. "
        f"The user's current ranked priorities are:\n{ranking_text}"
    )
    resp = ollama.chat(
        model=MODEL,
        messages=[{"role": "system", "content": system}, *messages],
        options={"temperature": 0.4},
    )
    return resp["message"]["content"].strip()
