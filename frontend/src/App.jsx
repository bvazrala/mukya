import { useState } from "react";
import { loadData, saveData, resetData } from "./storage.js";
import Home from "./pages/Home.jsx";
import Priorities from "./pages/Priorities.jsx";

export default function App() {
  const [view, setView] = useState("home");
  const [data, setData] = useState(loadData);

  // pass this down so pages can update + persist data in one call
  const update = (next) => {
    setData(next);
    saveData(next);
  };

  return (
    <div>
      <nav className="nav">
        <strong style={{ marginRight: "auto" }}>Mukya</strong>
        <button className={view === "home" ? "active" : ""} onClick={() => setView("home")}>Home</button>
        <button className={view === "priorities" ? "active" : ""} onClick={() => setView("priorities")}>Priorities</button>
        <button onClick={() => update(resetData())} title="Reload the sample data">Reset demo data</button>
      </nav>
      <div className="page">
        {view === "home"
          ? <Home data={data} update={update} />
          : <Priorities data={data} update={update} />}
      </div>
    </div>
  );
}
