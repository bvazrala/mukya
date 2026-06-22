import { useState } from "react";

import { makeItem } from "../storage.js";
import { TYPES } from "../lib.js";

const BLANK = { title: "", type: "task", category: "Misc", start: "", softDeadline: "", hardDeadline: "" };

export default function AddItemForm({ data, update }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);

  const categories = [...data.persona.priorities.map((p) => p.label), "Misc"];
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const toIso = (value) => (value ? new Date(value).toISOString() : null);

  const add = () => {
    if (!form.title.trim()) return;
    const item = makeItem({
      title: form.title.trim(),
      type: form.type,
      category: form.category,
      start: toIso(form.start),
      softDeadline: toIso(form.softDeadline),
      hardDeadline: toIso(form.hardDeadline),
      durationMin: form.start ? 60 : null,
    });
    update({ ...data, items: [...data.items, item] });
    setForm(BLANK);
    setOpen(false);
  };

  if (!open) {
    return (
      <div className="panel">
        <button className="action" onClick={() => setOpen(true)}>
          + Add item
        </button>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="form-grid">
        <input placeholder="Title" value={form.title} onChange={set("title")} />
        <select value={form.type} onChange={set("type")}>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select value={form.category} onChange={set("category")}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label>
          Start
          <input type="datetime-local" value={form.start} onChange={set("start")} />
        </label>
        <label>
          Soft deadline
          <input type="datetime-local" value={form.softDeadline} onChange={set("softDeadline")} />
        </label>
        <label>
          Hard deadline
          <input type="datetime-local" value={form.hardDeadline} onChange={set("hardDeadline")} />
        </label>
      </div>
      <div style={{ marginTop: 12 }}>
        <button className="action" onClick={add}>
          Add
        </button>
        <button onClick={() => setOpen(false)} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
