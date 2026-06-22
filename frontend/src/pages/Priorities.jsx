import { useState } from "react";

import PriorityRanker from "../components/PriorityRanker.jsx";
import LongTermGoals from "../components/LongTermGoals.jsx";
import EisenhowerMatrix from "../components/EisenhowerMatrix.jsx";
import ChatBox from "../components/ChatBox.jsx";
import { classify } from "../api.js";

export default function Priorities({ data, update }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const unscored = data.items.filter((i) => i.importance === null);

  const runClassify = async () => {
    setLoading(true);
    setError("");
    try {
      const targets = data.items.filter((i) => i.importanceSetBy !== "user");
      const results = await classify(
        targets.map((i) => ({ id: i.id, title: i.title, type: i.type, category: i.category })),
        data.persona
      );
      const byId = Object.fromEntries(results.map((r) => [r.id, r]));
      update({
        ...data,
        items: data.items.map((i) =>
          byId[i.id]
            ? {
                ...i,
                importance: byId[i.id].importance,
                importanceReason: byId[i.id].reason,
                importanceSetBy: i.importanceSetBy || "ai",
              }
            : i
        ),
      });
    } catch {
      setError("Could not reach the AI. Check that Ollama and the backend are running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col panel">
          <h3>Rank your priorities</h3>
          <PriorityRanker data={data} update={update} />
        </div>
        <div className="col panel">
          <h3>Long-term goals</h3>
          <LongTermGoals data={data} update={update} />
        </div>
      </div>

      <div className="panel">
        <h3>Talk it through with AI</h3>
        <ChatBox persona={data.persona} />
      </div>

      <div className="panel">
        <h3>Importance and the matrix</h3>
        <p className="muted">
          The AI scores importance from your priorities and goals. Change any number to set it yourself.
        </p>
        <button className="action" onClick={runClassify} disabled={loading}>
          {loading ? "Scoring..." : "Classify with AI"}
        </button>
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}
        {unscored.length > 0 && <p className="muted">{unscored.length} item(s) not yet scored.</p>}
        <div style={{ marginTop: 12 }}>
          <EisenhowerMatrix items={data.items} data={data} update={update} />
        </div>
      </div>
    </div>
  );
}
