// Click a task to cycle its status: unmarked → green → yellow → red → unmarked
const ORDER = ["unmarked", "green", "yellow", "red"];
const LABEL = { unmarked: "—", green: "done", yellow: "in progress", red: "missed" };

export default function TaskList({ tasks, data, update }) {
  const cycle = (id) => {
    update({
      ...data,
      items: data.items.map((i) =>
        i.id === id
          ? { ...i, status: ORDER[(ORDER.indexOf(i.status) + 1) % ORDER.length] }
          : i
      ),
    });
  };

  return (
    <div>
      {tasks.map((t) => (
        <div
          key={t.id}
          className={`item status-${t.status}`}
          style={{ cursor: "pointer" }}
          onClick={() => cycle(t.id)}
        >
          <strong>{t.title}</strong>
          <div style={{ fontSize: 12, color: "#666" }}>{t.category} · {LABEL[t.status]}</div>
        </div>
      ))}
      <p style={{ fontSize: 12, color: "#999" }}>Tip: click a task to change its status.</p>
    </div>
  );
}
