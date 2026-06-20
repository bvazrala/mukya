import Calendar from "../components/Calendar.jsx";
import TaskList from "../components/TaskList.jsx";
import UnscheduledBank from "../components/UnscheduledBank.jsx";

export default function Home({ data, update }) {
  return (
    <div>
      <div className="panel">
        <h3>Calendar</h3>
        <Calendar events={data.events} />
      </div>
      <div className="row">
        <div className="col panel">
          <h3>To-do / Reminders</h3>
          <TaskList tasks={data.tasks} data={data} update={update} />
        </div>
        <div className="col panel">
          <h3>Unscheduled</h3>
          <UnscheduledBank items={data.unscheduled} />
        </div>
      </div>
    </div>
  );
}
