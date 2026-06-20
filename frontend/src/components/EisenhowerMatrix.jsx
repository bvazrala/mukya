const QUADRANTS = [
  { key: "do", title: "Do — important & urgent", color: "#dbeac8" },
  { key: "schedule", title: "Schedule — important, not urgent", color: "#f6c9c0" },
  { key: "delegate", title: "Delegate — urgent, not important", color: "#f3d9a8" },
  { key: "delete", title: "Delete — neither", color: "#bfe0e0" },
];

export default function EisenhowerMatrix({ results }) {
  const inQuadrant = (k) => results.filter((r) => r.quadrant === k);
  return (
    <div className="matrix">
      {QUADRANTS.map((q) => (
        <div key={q.key} className="quadrant" style={{ background: q.color }}>
          <h4>{q.title}</h4>
          {inQuadrant(q.key).length === 0 && <p style={{ fontSize: 12, color: "#777" }}>—</p>}
          {inQuadrant(q.key).map((r) => (
            <div key={r.id} className="item" title={r.reason}>
              <strong>{r.title}</strong>
              <div style={{ fontSize: 11, color: "#555" }}>
                importance {r.importance}/10{r.urgent ? " · urgent" : ""} — {r.reason}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
