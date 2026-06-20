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
      // Tasks come from both the to-do list and the unscheduled bank.
      const tasks = [
        ...data.tasks.map((t) => ({ id: t.id, title: t.title, deadline: t.deadline, category: t.category })),
        ...data.unscheduled.map((u) => ({ id: u.id, title: u.title, deadline: null, category: u.category })),
      ];
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
          <p style={{ fontSize: 12, color: "#666" }}>Drag to reorder. (Ties like 1 / 1 / 3 are kept in the data - the UI for editing ties is a next step.)</p>
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
