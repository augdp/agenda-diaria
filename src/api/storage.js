/**
 * API client — all storage goes through the Express server.
 * In dev, Vite proxies /api to localhost:3001.
 */

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

/* ── Universes ── */

export async function getUniverses() {
  return request("/api/universes");
}

export async function saveUniverses(data) {
  return request("/api/universes", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* ── Templates ── */

export async function getTemplates() {
  return request("/api/templates");
}

export async function saveTemplates(data) {
  return request("/api/templates", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* ── Plan ── */

export async function getPlan() {
  return request("/api/plan");
}

export async function savePlan(data) {
  return request("/api/plan", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* ── Day data ── */

export async function getDay(dateStr) {
  return request(`/api/days/${dateStr}`);
}

export async function saveDay(dateStr, data) {
  return request(`/api/days/${dateStr}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
