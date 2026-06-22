const KEY = "mukya:v2";

function iso(daysFromNow, hour, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function makeItem(p = {}) {
  return {
    id: crypto.randomUUID(),
    title: p.title || "Untitled",
    type: p.type || "task",
    start: p.start ?? null,
    durationMin: p.durationMin ?? null,
    hardDeadline: p.hardDeadline ?? null,
    softDeadline: p.softDeadline ?? null,
    importance: p.importance ?? null,
    importanceSetBy: p.importanceSetBy ?? null,
    importanceReason: p.importanceReason ?? "",
    status: p.status || "unmarked",
    category: p.category || "Misc",
    completedAt: p.completedAt ?? null,
  };
}

function seed() {
  return {
    persona: {
      priorities: [
        { rank: 1, label: "Education" },
        { rank: 2, label: "Working out" },
        { rank: 3, label: "Sleeping" },
      ],
      goals: [{ id: crypto.randomUUID(), text: "Become a professional software engineer in 5 years" }],
    },
    categories: ["Education", "Working out", "Sleeping", "Misc"],
    items: [
      makeItem({ title: "CS61A lecture", type: "event", category: "Education", start: iso(0, 14), durationMin: 60, status: "yellow" }),
      makeItem({ title: "Morning gym session", type: "event", category: "Working out", start: iso(0, 7), durationMin: 60, status: "green" }),
      makeItem({ title: "Lights out by 11pm", type: "commitment", category: "Sleeping", start: iso(0, 23), durationMin: 30 }),
      makeItem({ title: "Finish problem set 4", type: "task", category: "Education", softDeadline: iso(1, 17), hardDeadline: iso(2, 17) }),
      makeItem({ title: "Meal prep for the week", type: "task", category: "Working out", softDeadline: iso(2, 18) }),
      makeItem({ title: "Reply to club emails", type: "task", category: "Misc", softDeadline: iso(0, 20) }),
      makeItem({ title: "Read 20 pages of SICP", type: "task", category: "Education" }),
      makeItem({ title: "Call home", type: "commitment", category: "Misc" }),
    ],
  };
}

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const data = JSON.parse(raw);
    if (!data.persona || !Array.isArray(data.items)) return seed();
    return data;
  } catch {
    return seed();
  }
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
  return data;
}

export function resetData() {
  const fresh = seed();
  saveData(fresh);
  return fresh;
}
