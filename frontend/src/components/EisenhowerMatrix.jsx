import { quadrant, isUrgent } from "../lib.js";

const QUADRANTS = [
  { key: "do", title: "Do now · important and urgent", color: "#dcfce7" },
  { key: "schedule", title: "Schedule · important, not urgent", color: "#fee2e2" },
  { key: "delegate", title: "Delegate · urgent, not important", color: "#fef3c7" },
  { key: "delete", title: "Drop · neither", color: "#e0f2fe" },
];

export default function EisenhowerMatrix({ items, data, update }) {
  const scored = items.filter((i) => i.importance !== null);

  const setImportance = (id, value) => {
    const v = Math.max(1, Math.min(10, Number(value) || 1));
    update({
      ...data,
      items: data.items.map((i) =>
        i.id === id ? { ...i, importance: v, importanceSetBy: "user" } : i
      ),
    });
  };

  return (
    <div className="matrix">
      {QUADRANTS.map((q) => {
        const inQuadrant = scored.filter((i) => quadrant(i) === q.key);
        return (
          <div key={q.key} className="quadrant" style={{ background: q.color }}>
            <h4>{q.title}</h4>
            {inQuadrant.length === 0 && <p className="muted">Empty</p>}
            {inQuadrant.map((i) => (
              <div key={i.id} className="item">
                <div className="item-row">
                  <strong>{i.title}</strong>
                  <span className="muted">{i.importanceSetBy === "user" ? "you" : "AI"}</span>
                </div>
                <div className="muted" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  importance
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={i.importance}
                    onChange={(e) => setImportance(i.id, e.target.value)}
                    style={{ width: 56 }}
                  />
                  {isUrgent(i) && <span>· urgent</span>}
                </div>
                {i.importanceReason && (
                  <div className="muted" style={{ marginTop: 4 }}>
                    {i.importanceReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
