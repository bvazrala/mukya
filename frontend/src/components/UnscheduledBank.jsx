export default function UnscheduledBank({ items }) {
  return (
    <div>
      {items.map((u) => (
        <div key={u.id} className={`item status-${u.status}`}>
          <strong>{u.title}</strong>
          <div style={{ fontSize: 12, color: "#666" }}>{u.category}</div>
        </div>
      ))}
      <p style={{ fontSize: 12, color: "#999" }}>Next step: drag these onto the calendar (FullCalendar's interaction plugin is installed).</p>
    </div>
  );
}
