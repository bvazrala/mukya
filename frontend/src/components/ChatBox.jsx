import { useState } from "react";
import { chat } from "../api.js";

export default function ChatBox({ priorities }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const reply = await chat(next, priorities);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "(Couldn't reach the AI — is the backend + Ollama running?)" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ maxHeight: 220, overflowY: "auto", marginBottom: 8 }}>
        {messages.map((m, i) => (
          <div key={i} className="item" style={{ background: m.role === "user" ? "#eef2ff" : "#f3f4f6" }}>
            <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.content}
          </div>
        ))}
        {loading && <p style={{ fontSize: 12, color: "#999" }}>Thinking...</p>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="e.g. Help me decide what matters most this week"
        />
        <button className="action" onClick={send} disabled={loading}>Send</button>
      </div>
    </div>
  );
}
