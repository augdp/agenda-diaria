/** Generate a short unique id. */
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** "08:30" → 510 */
export function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** 510 → "08:30" */
export function minutesToTime(m) {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** 135 → "2h15m", 30 → "30min" */
export function formatMinutes(m) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h > 0) return `${h}h${min > 0 ? min + "m" : ""}`;
  return `${min}min`;
}

/** Deep-clone a JSON-safe object. */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
