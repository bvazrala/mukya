async function post(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} failed`);
  return res.json();
}

export async function classify(items, persona) {
  const data = await post("/api/classify", { items, persona });
  return data.results;
}

export async function chat(messages, persona) {
  const data = await post("/api/chat", { messages, persona });
  return data.reply;
}
