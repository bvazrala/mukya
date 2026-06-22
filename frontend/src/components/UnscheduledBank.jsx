import { useEffect, useRef } from "react";
import { Draggable } from "@fullcalendar/interaction";

import { cycledItem, STATUS_LABEL } from "../lib.js";

export default function UnscheduledBank({ items, data, update }) {
  const ref = useRef(null);

  useEffect(() => {
    const draggable = new Draggable(ref.current, {
      itemSelector: ".draggable-item",
      eventData: (el) => ({ id: el.dataset.id, title: el.dataset.title, duration: "01:00" }),
    });
    return () => draggable.destroy();
  }, []);

  const cycle = (id) =>
    update({ ...data, items: data.items.map((i) => (i.id === id ? cycledItem(i) : i)) });

  const remove = (id, e) => {
    e.stopPropagation();
    update({ ...data, items: data.items.filter((i) => i.id !== id) });
  };

  return (
    <div ref={ref}>
      {items.map((u) => (
        <div
          key={u.id}
          className={`item status-${u.status} draggable-item`}
          data-id={u.id}
          data-title={u.title}
          style={{ cursor: "grab" }}
          onClick={() => cycle(u.id)}
          title="Drag onto the calendar to schedule"
        >
          <div className="item-row">
            <strong>{u.title}</strong>
            <button className="x" onClick={(e) => remove(u.id, e)} title="Delete">
              ×
            </button>
          </div>
          <div className="muted">
            {u.category} · {u.type} · {STATUS_LABEL[u.status]}
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="muted">Nothing here yet.</p>}
      <p className="muted">Drag an item onto the calendar to schedule it.</p>
    </div>
  );
}
