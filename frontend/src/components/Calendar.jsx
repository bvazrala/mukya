import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { STATUS_COLOR, cycledItem } from "../lib.js";

export default function Calendar({ items, data, update }) {
  const events = items.map((i) => {
    const start = new Date(i.start);
    const end = new Date(start.getTime() + (i.durationMin || 60) * 60000);
    return {
      id: i.id,
      title: i.title,
      start: i.start,
      end: end.toISOString(),
      backgroundColor: STATUS_COLOR[i.status],
      borderColor: STATUS_COLOR[i.status],
    };
  });

  const onClick = ({ event }) =>
    update({
      ...data,
      items: data.items.map((i) => (i.id === event.id ? cycledItem(i) : i)),
    });

  const onReceive = (info) => {
    update({
      ...data,
      items: data.items.map((i) =>
        i.id === info.event.id
          ? { ...i, start: info.event.start.toISOString(), durationMin: 60 }
          : i
      ),
    });
    info.event.remove();
  };

  return (
    <FullCalendar
      plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{ left: "prev,next today", center: "title", right: "timeGridWeek,dayGridMonth" }}
      events={events}
      height={520}
      nowIndicator
      droppable
      eventClick={onClick}
      eventReceive={onReceive}
    />
  );
}
