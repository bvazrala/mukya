import { useEffect, useRef } from "react";
import { Draggable } from "@fullcalendar/interaction";

// Click to cycle status; drag onto the calendar to schedule.
const ORDER = ["unmarked", "green", "yellow", "red"];
const LABEL = { unmarked: "—", green: "done", yellow: "in progress", red: "missed" };

export default function UnscheduledBank({ items, data, update }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Register this container with FullCalendar so any .unscheduled-item inside
    // it can be dragged onto the calendar.
    const draggable = new Draggable(containerRef.current, {
      itemSelector: ".unscheduled-item",
      eventData: (el) => ({
        id: el.dataset.id,
        title: el.dataset.title,
        duration: "01:00", // default block of 1 hour on drop
      }),
    });
    return () => draggable.destroy();
  }, []);

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
    <div ref={containerRef}>
      {items.map((u) => (
        <div
          key={u.id}
          // "unscheduled-item" is the selector the Draggable instance targets
          className={`item status-${u.status} unscheduled-item`}
          data-id={u.id}
          data-title={u.title}
          style={{ cursor: "pointer" }}
          onClick={() => cycle(u.id)}
          title="Click to change status · Drag onto the calendar to schedule"
        >
          <strong>{u.title}</strong>
          <div style={{ fontSize: 12, color: "#666" }}>{u.category} · {LABEL[u.status]}</div>
        </div>
      ))}
      <p style={{ fontSize: 12, color: "#999" }}>
        Drag an item onto the calendar to schedule it. Click to change its status.
      </p>
    </div>
  );
}
