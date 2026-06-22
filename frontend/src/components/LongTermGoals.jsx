import { useState } from "react";

export default function LongTermGoals({ data, update }) {
  const [text, setText] = useState("");
  const goals = data.persona.goals;

  const add = () => {
    if (!text.trim()) return;
    const goal = { id: crypto.randomUUID(), text: text.trim() };
    update({ ...data, persona: { ...data.persona, goals: [...goals, goal] } });
    setText("");
  };

  const remove = (id) =>
    update({ ...data, persona: { ...data.persona, goals: goals.filter((g) => g.id !== id) } });

  return (
    <div>
      {goals.map((g) => (
        <div key={g.id} className="item">
          <div className="item-row">
            <span>{g.text}</span>
            <button className="x" onClick={() => remove(g.id)} title="Delete">
              ×
            </button>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <input
          style={{ flex: 1 }}
          placeholder="e.g. Become a software engineer in 5 years"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="action" onClick={add}>
          Add
        </button>
      </div>
    </div>
  );
}
