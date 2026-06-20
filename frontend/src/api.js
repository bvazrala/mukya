// Calls to the local FastAPI backend. Vite proxies /api -> http://localhost:8000.

export async function prioritize(tasks, priorities, categories) {
  const res = await fetch("/api/prioritize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks, priorities, categories }),
  });
  if (!res.ok) throw new Error("prioritize failed");
  const data = await res.json();
  return data.results;
}

export async function chat(messages, priorities) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, priorities }),
  });
  if (!res.ok) throw new Error("chat failed");
  const data = await res.json();
  return data.reply;
}
