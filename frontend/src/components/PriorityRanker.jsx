export default function PriorityRanker({ data, update }) {
  const sorted = [...data.persona.priorities].sort((a, b) => a.rank - b.rank);

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];
    update({
      ...data,
      persona: { ...data.persona, priorities: next.map((p, i) => ({ ...p, rank: i + 1 })) },
    });
  };

  return (
    <div>
      {sorted.map((p, i) => (
        <div key={p.label} className="item" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="muted" style={{ width: 24 }}>
            #{i + 1}
          </span>
          <strong style={{ flex: 1 }}>{p.label}</strong>
          <button onClick={() => move(i, -1)} disabled={i === 0}>
            ↑
          </button>
          <button onClick={() => move(i, 1)} disabled={i === sorted.length - 1}>
            ↓
          </button>
        </div>
      ))}
    </div>
  );
}
