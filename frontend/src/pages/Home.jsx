import AddItemForm from "../components/AddItemForm.jsx";
import Calendar from "../components/Calendar.jsx";
import TaskList from "../components/TaskList.jsx";
import UnscheduledBank from "../components/UnscheduledBank.jsx";

export default function Home({ data, update }) {
  const scheduled = data.items.filter((i) => i.start !== null);
  const unscheduled = data.items.filter((i) => i.start === null);

  const rankOf = (item) => {
    const match = data.persona.priorities.find((p) => p.label === item.category);
    return match ? match.rank : 999;
  };
  const todo = [...scheduled].sort((a, b) => rankOf(a) - rankOf(b));

  return (
    <div>
      <AddItemForm data={data} update={update} />

      <div className="panel">
        <h3>Calendar</h3>
        <Calendar items={scheduled} data={data} update={update} />
      </div>

      <div className="row">
        <div className="col panel">
          <h3>To-do and reminders</h3>
          <TaskList items={todo} data={data} update={update} />
        </div>
        <div className="col panel">
          <h3>Unscheduled</h3>
          <UnscheduledBank items={unscheduled} data={data} update={update} />
        </div>
      </div>
    </div>
  );
}
