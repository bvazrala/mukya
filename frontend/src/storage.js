// All app data lives in the browser via localStorage. No backend database (yet).
// When you build the "real" version, the FastAPI backend can take this over.

const KEY = "mukya:data";

// status: "unmarked" | "green" (done) | "yellow" (in progress) | "red" (missed)
function seed() {
  const today = new Date();
  const iso = (daysFromNow, hour = 9) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };
  return {
    events: [
      { id: "e1", title: "Gym session", start: iso(0, 7), status: "green", category: "Health" },
      { id: "e2", title: "CS61A lecture", start: iso(0, 14), status: "yellow", category: "Education" },
      { id: "e3", title: "Sleep by 11pm", start: iso(0, 23), status: "unmarked", category: "Health" },
      { id: "e4", title: "Project deadline", start: iso(1, 17), status: "red", category: "Education" },
    ],
    tasks: [
      { id: "t1", title: "Finish problem set", deadline: iso(1, 17), status: "unmarked", category: "Education" },
      { id: "t2", title: "Meal prep for the week", deadline: iso(2, 18), status: "unmarked", category: "Health" },
      { id: "t3", title: "Reply to club emails", deadline: iso(0, 20), status: "yellow", category: "Misc" },
    ],
    unscheduled: [
      { id: "u1", title: "Read 20 pages", status: "unmarked", category: "Education" },
      { id: "u2", title: "Call home", status: "unmarked", category: "Misc" },
    ],
    priorities: [
      { rank: 1, label: "Working out" },
      { rank: 1, label: "Sleeping" },
      { rank: 3, label: "Education" },
    ],
    categories: ["Health", "Education", "Misc"],
  };
}

export function loadData() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const data = seed();
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  }
  return JSON.parse(raw);
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function resetData() {
  localStorage.removeItem(KEY);
  return loadData();
}
