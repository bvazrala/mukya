import { STATUS_COLOR, IMPORTANT_THRESHOLD } from "../lib.js";

function Bar({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="item-row">
        <span>{label}</span>
        <span className="muted">
          {value} of {total} ({pct}%)
        </span>
      </div>
      <div className="bar">
        <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function Analytics({ data }) {
  const items = data.items;
  const total = items.length;
  const count = (status) => items.filter((i) => i.status === status).length;

  const important = items.filter((i) => (i.importance ?? 0) >= IMPORTANT_THRESHOLD);
  const other = items.filter((i) => i.importance !== null && i.importance < IMPORTANT_THRESHOLD);
  const importantDone = important.filter((i) => i.status === "green").length;
  const otherDone = other.filter((i) => i.status === "green").length;

  return (
    <div>
      <div className="panel">
        <h3>Completion</h3>
        <Bar label="Completed" value={count("green")} total={total} color={STATUS_COLOR.green} />
        <Bar label="In progress" value={count("yellow")} total={total} color={STATUS_COLOR.yellow} />
        <Bar label="Missed" value={count("red")} total={total} color={STATUS_COLOR.red} />
        <Bar label="Not started" value={count("unmarked")} total={total} color={STATUS_COLOR.unmarked} />
      </div>

      <div className="panel">
        <h3>Are you sticking to your priorities?</h3>
        <p className="muted">How much of the important work you actually finish, against the rest.</p>
        {important.length === 0 ? (
          <p className="muted">Classify your items on the Priorities page to unlock this.</p>
        ) : (
          <>
            <Bar label="Important items completed" value={importantDone} total={important.length} color="#22c55e" />
            <Bar label="Other items completed" value={otherDone} total={other.length} color="#94a3b8" />
          </>
        )}
      </div>

      <div className="panel">
        <h3>Trends</h3>
        <p className="muted">
          On-time rate, quadrant flow, and week over week trends arrive in the next pass. They need a little
          history to build up first.
        </p>
      </div>
    </div>
  );
}
