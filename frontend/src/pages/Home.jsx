import Calendar from "../components/Calendar.jsx";
import TaskList from "../components/TaskList.jsx";
import UnscheduledBank from "../components/UnscheduledBank.jsx";

export default function Home({ data, update }) {
  // Derive three views from the single items array.
  const scheduled   = data.items.filter((i) => i.start !== null);
  const unscheduled = data.items.filter((i) => i.start === null);

  // Sort the to-do list by priority rank (lowest rank = highest priority).
  // Items whose category doesn't match any priority label go to the bottom.
  const rankOf = (item) => {
    const p = data.priorities.find((p) => p.label === item.category);
    return p ? p.rank : 999;
  };
  const todoItems = [...scheduled].sort((a, b) => rankOf(a) - rankOf(b));

  return (
    <div>
      <div className="panel">
        <h3>Calendar</h3>
        <Calendar events={scheduled} data={data} update={update} />
      </div>
      <div className="row">
        <div className="col panel">
          <h3>To-do / Reminders</h3>
          <TaskList tasks={todoItems} data={data} update={update} />
        </div>
        <div className="col panel">
          <h3>Unscheduled</h3>
          <UnscheduledBank items={unscheduled} data={data} update={update} />
        </div>
      </div>
    </div>
  );
}
