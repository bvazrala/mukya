import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// status -> color (unmarked / completed / in-progress / missed)
const COLORS = { unmarked: "#94a3b8", green: "#22c55e", yellow: "#eab308", red: "#ef4444" };

export default function Calendar({ events }) {
  const fcEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.start,
    backgroundColor: COLORS[e.status] || COLORS.unmarked,
    borderColor: COLORS[e.status] || COLORS.unmarked,
  }));

  return (
    <FullCalendar
      plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{ left: "prev,next today", center: "title", right: "timeGridWeek,dayGridMonth" }}
      events={fcEvents}
      height={520}
      nowIndicator={true}
    />
  );
}
