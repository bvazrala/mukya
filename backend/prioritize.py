import json
import os
import ollama

MODEL = os.getenv("MUKYA_MODEL", "gemma4:12b")

STYLE = (
    "Write in short clear sentences. Do not use hyphens or dashes except in numeric "
    "ranges like 8-10. Keep sentences free of long comma chains."
)


def _persona_text(persona):
    priorities = sorted(persona.get("priorities", []), key=lambda x: x.get("rank", 999))
    p_text = "\n".join(f'  rank {p["rank"]}: {p["label"]}' for p in priorities) or "  none set"
    g_text = "\n".join(f'  {g["text"]}' for g in persona.get("goals", [])) or "  none set"
    return p_text, g_text


def classify(items, persona):
    if not items:
        return []

    p_text, g_text = _persona_text(persona)
    item_lines = "\n".join(
        f'  id={it["id"]} type={it["type"]} area={it.get("category", "none")}: "{it["title"]}"'
        for it in items
    )

    system = (
        "You judge how important each item is to this specific person. "
        "Their ranked priorities and long term goals are your only rubric. "
        "An item that serves a top ranked priority or a long term goal is important and scores 8 to 10. "
        "An item tied to a lower ranked or unlisted area is less important and scores 1 to 4. "
        "Weigh the item type. A fixed event or real commitment carries more weight than a small chore. "
        f"{STYLE} "
        'Reply with only JSON shaped like {"items": [{"id": "...", "importance": 7, "reason": "short phrase"}]}.'
    )
    user = f"Ranked priorities:\n{p_text}\n\nLong term goals:\n{g_text}\n\nItems:\n{item_lines}"

    for _ in range(2):
        resp = ollama.chat(
            model=MODEL,
            messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
            format="json",
            options={"temperature": 0.1},
        )
        try:
            data = json.loads(resp["message"]["content"])
            out = []
            for x in data.get("items", []):
                out.append(
                    {
                        "id": str(x["id"]),
                        "importance": max(1, min(10, int(x.get("importance", 5)))),
                        "reason": str(x.get("reason", "")).strip(),
                    }
                )
            return out
        except (json.JSONDecodeError, KeyError, ValueError, TypeError):
            continue
    return []


def chat(messages, persona):
    p_text, g_text = _persona_text(persona)
    system = (
        "You are a planning coach. You help the person decide what matters and how to spend their time. "
        "When their priorities are unclear, ask one focused question before giving advice. "
        f"{STYLE}\n\nTheir ranked priorities:\n{p_text}\n\nTheir long term goals:\n{g_text}"
    )
    resp = ollama.chat(
        model=MODEL,
        messages=[{"role": "system", "content": system}, *messages],
        options={"temperature": 0.4},
    )
    return resp["message"]["content"].strip()
