// All app data lives in the browser via localStorage. No backend database.
//
// ONE unified items array. Each item: { id, title, start, status, category }
//   start = ISO datetime string  →  item is scheduled (shows on calendar + to-do)
//   start = null                 →  item is unscheduled (shows in the bank)

const KEY = "mukya:data";

// Category values intentionally match the priority labels so sorting + AI work cleanly.
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
    items: [
      // --- scheduled items (start set) — appear on calendar AND to-do list ---
      { id: "e1", title: "Gym session",            start: iso(0, 7),  status: "green",    category: "Working out" },
      { id: "e2", title: "CS61A lecture",           start: iso(0, 14), status: "yellow",   category: "Education"   },
      { id: "e3", title: "Sleep by 11pm",           start: iso(0, 23), status: "unmarked", category: "Sleeping"    },
      { id: "e4", title: "Project deadline",        start: iso(1, 17), status: "red",      category: "Education"   },
      { id: "t1", title: "Finish problem set",      start: iso(1, 17), status: "unmarked", category: "Education"   },
      { id: "t2", title: "Meal prep for the week",  start: iso(2, 18), status: "unmarked", category: "Working out" },
      { id: "t3", title: "Reply to club emails",    start: iso(0, 20), status: "yellow",   category: "Misc"        },
      // --- unscheduled items (start = null) — appear in the unscheduled bank ---
      { id: "u1", title: "Read 20 pages", start: null, status: "unmarked", category: "Education" },
      { id: "u2", title: "Call home",     start: null, status: "unmarked", category: "Misc"      },
    ],
    // Lower rank = more important. Labels intentionally match category values above.
    priorities: [
      { rank: 1, label: "Working out" },
      { rank: 1, label: "Sleeping"    },
      { rank: 3, label: "Education"   },
    ],
    categories: ["Working out", "Sleeping", "Education", "Misc"],
  };
}

export function loadData() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const data = seed();
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  }
  const data = JSON.parse(raw);
  // Migrate old format (events / tasks / unscheduled) to unified items.
  if (!data.items) {
    localStorage.removeItem(KEY);
    return loadData();
  }
  return data;
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function resetData() {
  localStorage.removeItem(KEY);
  return loadData();
}
