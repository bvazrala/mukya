import { useState } from "react";
import PriorityRanker from "../components/PriorityRanker.jsx";
import EisenhowerMatrix from "../components/EisenhowerMatrix.jsx";
import ChatBox from "../components/ChatBox.jsx";
import { prioritize } from "../api.js";

export default function Priorities({ data, update }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runPrioritize = async () => {
    setLoading(true);
    setError("");
    try {
      // Send all items to the AI. `start` doubles as the deadline for urgency maths.
      const tasks = data.items.map((i) => ({
        id: i.id,
        title: i.title,
        deadline: i.start,    // null for unscheduled → not urgent
        category: i.category,
      }));
      setResults(await prioritize(tasks, data.priorities, data.categories));
    } catch {
      setError("Couldn't reach the AI. Is Ollama running and the backend started? (See README.)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col panel">
          <h3>Rank your priorities</h3>
          <p style={{ fontSize: 12, color: "#666" }}>
            Use ↑ / ↓ to reorder. The AI uses this ranking to judge how important each task is.
          </p>
          <PriorityRanker priorities={data.priorities} data={data} update={update} />
        </div>
        <div className="col panel">
          <h3>Figure it out with AI</h3>
          <ChatBox priorities={data.priorities} />
        </div>
      </div>

      <div className="panel">
        <h3>Eisenhower Matrix</h3>
        <button className="action" onClick={runPrioritize} disabled={loading}>
          {loading ? "Thinking..." : "Prioritize my tasks with AI"}
        </button>
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}
        <div style={{ marginTop: 12 }}>
          <EisenhowerMatrix results={results} />
        </div>
      </div>
    </div>
  );
}
