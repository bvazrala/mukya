import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const STATUS_ORDER = ["unmarked", "green", "yellow", "red"];
const COLORS = { unmarked: "#94a3b8", green: "#22c55e", yellow: "#eab308", red: "#ef4444" };

export default function Calendar({ events, data, update }) {
  const fcEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.start,
    backgroundColor: COLORS[e.status] ?? COLORS.unmarked,
    borderColor:     COLORS[e.status] ?? COLORS.unmarked,
  }));

  // Click a calendar event to cycle its status (same logic as the to-do list).
  const handleEventClick = ({ event }) => {
    update({
      ...data,
      items: data.items.map((i) =>
        i.id === event.id
          ? { ...i, status: STATUS_ORDER[(STATUS_ORDER.indexOf(i.status) + 1) % STATUS_ORDER.length] }
          : i
      ),
    });
  };

  // An unscheduled item was dragged and dropped here — give it a start time.
  const handleEventReceive = (info) => {
    update({
      ...data,
      items: data.items.map((i) =>
        i.id === info.event.id
          ? { ...i, start: info.event.start.toISOString() }
          : i
      ),
    });
    // Remove FullCalendar's internally-added copy; React state drives the render.
    info.event.remove();
  };

  return (
    <FullCalendar
      plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{ left: "prev,next today", center: "title", right: "timeGridWeek,dayGridMonth" }}
      events={fcEvents}
      height={520}
      nowIndicator={true}
      droppable={true}
      eventClick={handleEventClick}
      eventReceive={handleEventReceive}
    />
  );
}
