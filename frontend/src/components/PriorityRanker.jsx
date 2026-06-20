// Lets the user reorder their priorities with ↑ / ↓ buttons.
// Ranks are normalised to 1, 2, 3… after every move so there are no gaps.
export default function PriorityRanker({ priorities, data, update }) {
  // Always display in rank order
  const sorted = [...priorities].sort((a, b) => a.rank - b.rank);

  const move = (index, direction) => {
    const next = [...sorted];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    // Swap the two entries in the array
    [next[index], next[target]] = [next[target], next[index]];
    // Reassign ranks so they're always 1, 2, 3…
    update({ ...data, priorities: next.map((p, i) => ({ ...p, rank: i + 1 })) });
  };

  return (
    <div>
      {sorted.map((p, i) => (
        <div
          key={p.label}
          className="item"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <span style={{ color: "#999", fontSize: 12, width: 24 }}>#{i + 1}</span>
          <strong style={{ flex: 1 }}>{p.label}</strong>
          <button
            onClick={() => move(i, -1)}
            disabled={i === 0}
            title="Move up"
            style={{ padding: "2px 8px" }}
          >↑</button>
          <button
            onClick={() => move(i, 1)}
            disabled={i === sorted.length - 1}
            title="Move down"
            style={{ padding: "2px 8px" }}
          >↓</button>
        </div>
      ))}
    </div>
  );
}
