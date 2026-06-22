import { useState } from "react";

import { chat } from "../api.js";

export default function ChatBox({ persona }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const next = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const reply = await chat(next, persona);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Could not reach the AI. Check that Ollama and the backend are running." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: 8 }}>
        {messages.length === 0 && (
          <p className="muted">Ask what to focus on, or let the AI ask you about your priorities.</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className="item"
            style={{ background: m.role === "user" ? "#eef2ff" : "#f3f4f6" }}
          >
            <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.content}
          </div>
        ))}
        {loading && <p className="muted">Thinking...</p>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about your priorities or what to focus on"
        />
        <button className="action" onClick={send} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
