import { useState } from "react";

import { loadData, saveData, resetData } from "./storage.js";
import Home from "./pages/Home.jsx";
import Priorities from "./pages/Priorities.jsx";
import Analytics from "./pages/Analytics.jsx";

const TABS = { home: Home, priorities: Priorities, analytics: Analytics };

export default function App() {
  const [view, setView] = useState("home");
  const [data, setData] = useState(loadData);

  const update = (next) => {
    setData(next);
    saveData(next);
  };

  const View = TABS[view];

  return (
    <div>
      <nav className="nav">
        <strong className="brand">Mukya</strong>
        {Object.keys(TABS).map((key) => (
          <button key={key} className={view === key ? "active" : ""} onClick={() => setView(key)}>
            {key[0].toUpperCase() + key.slice(1)}
          </button>
        ))}
        <button className="ghost" onClick={() => update(resetData())}>
          Reset demo data
        </button>
      </nav>
      <main className="page">
        <View data={data} update={update} />
      </main>
    </div>
  );
}
