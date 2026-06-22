export const STATUS = ["unmarked", "green", "yellow", "red"];

export const STATUS_LABEL = {
  unmarked: "not started",
  green: "completed",
  yellow: "in progress",
  red: "missed",
};

export const STATUS_COLOR = {
  unmarked: "#94a3b8",
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
};

export const TYPES = ["event", "task", "commitment"];

export const URGENT_WINDOW_HOURS = 48;
export const IMPORTANT_THRESHOLD = 6;

export function isUrgent(item) {
  const due = item.softDeadline || item.hardDeadline;
  if (!due) return false;
  const hours = (new Date(due) - Date.now()) / 3600000;
  return hours <= URGENT_WINDOW_HOURS;
}

export function quadrant(item) {
  const important = (item.importance ?? 0) >= IMPORTANT_THRESHOLD;
  const urgent = isUrgent(item);
  if (important && urgent) return "do";
  if (important && !urgent) return "schedule";
  if (!important && urgent) return "delegate";
  return "delete";
}

export function nextStatus(status) {
  return STATUS[(STATUS.indexOf(status) + 1) % STATUS.length];
}

export function cycledItem(item) {
  const status = nextStatus(item.status);
  return {
    ...item,
    status,
    completedAt: status === "green" ? new Date().toISOString() : null,
  };
}
