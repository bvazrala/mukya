import { cycledItem, STATUS_LABEL } from "../lib.js";

export default function TaskList({ items, data, update }) {
  const cycle = (id) =>
    update({ ...data, items: data.items.map((i) => (i.id === id ? cycledItem(i) : i)) });

  const remove = (id, e) => {
    e.stopPropagation();
    update({ ...data, items: data.items.filter((i) => i.id !== id) });
  };

  if (items.length === 0) return <p className="muted">Nothing scheduled yet.</p>;

  return (
    <div>
      {items.map((t) => (
        <div
          key={t.id}
          className={`item status-${t.status}`}
          style={{ cursor: "pointer" }}
          onClick={() => cycle(t.id)}
          title="Click to change status"
        >
          <div className="item-row">
            <strong>{t.title}</strong>
            <button className="x" onClick={(e) => remove(t.id, e)} title="Delete">
              ×
            </button>
          </div>
          <div className="muted">
            {t.category} · {t.type} · {STATUS_LABEL[t.status]}
          </div>
        </div>
      ))}
    </div>
  );
}
