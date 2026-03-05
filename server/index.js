import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DAYS_DIR = path.join(DATA_DIR, "days");

const app = express();
app.use(express.json());

/* ── Helpers ── */

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readJSON(filepath, fallback = null) {
  try {
    const raw = await fs.readFile(filepath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeJSON(filepath, data) {
  await ensureDir(path.dirname(filepath));
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), "utf-8");
}

/* ═══════════════════════════════════════
   UNIVERSES  →  data/universes.json
   ═══════════════════════════════════════ */

const UNIVERSES_FILE = path.join(DATA_DIR, "universes.json");

app.get("/api/universes", async (_req, res) => {
  const data = await readJSON(UNIVERSES_FILE);
  res.json(data);
});

app.put("/api/universes", async (req, res) => {
  await writeJSON(UNIVERSES_FILE, req.body);
  res.json({ ok: true });
});

/* ═══════════════════════════════════════
   TEMPLATES  →  data/templates.json
   Array of ritual templates with activities
   ═══════════════════════════════════════ */

const TEMPLATES_FILE = path.join(DATA_DIR, "templates.json");

app.get("/api/templates", async (_req, res) => {
  const data = await readJSON(TEMPLATES_FILE, []);
  res.json(data);
});

app.put("/api/templates", async (req, res) => {
  await writeJSON(TEMPLATES_FILE, req.body);
  res.json({ ok: true });
});

/* ═══════════════════════════════════════
   PLAN  →  data/plan.json
   Weekly plan: { days: { 0: [...], ... } }
   Each entry references a template by ID + startTime
   ═══════════════════════════════════════ */

const PLAN_FILE = path.join(DATA_DIR, "plan.json");

app.get("/api/plan", async (_req, res) => {
  const data = await readJSON(PLAN_FILE);
  res.json(data);
});

app.put("/api/plan", async (req, res) => {
  await writeJSON(PLAN_FILE, req.body);
  res.json({ ok: true });
});

/* ═══════════════════════════════════════
   DAY DATA  →  data/days/{date}.json
   Execution data for a specific date
   ═══════════════════════════════════════ */

app.get("/api/days/:date", async (req, res) => {
  const file = path.join(DAYS_DIR, `${req.params.date}.json`);
  const data = await readJSON(file);
  res.json(data);
});

app.put("/api/days/:date", async (req, res) => {
  const file = path.join(DAYS_DIR, `${req.params.date}.json`);
  await writeJSON(file, req.body);
  res.json({ ok: true });
});

/** List all day files (for history range queries) */
app.get("/api/days", async (_req, res) => {
  try {
    await ensureDir(DAYS_DIR);
    const files = await fs.readdir(DAYS_DIR);
    const dates = files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""));
    res.json(dates);
  } catch {
    res.json([]);
  }
});

/* ═══════════════════════════════════════
   START
   ═══════════════════════════════════════ */

const PORT = process.env.PORT || 3001;

await ensureDir(DAYS_DIR);

app.listen(PORT, () => {
  console.log(`\n  📁 Agenda API rodando em http://localhost:${PORT}`);
  console.log(`  📂 Dados em: ${DATA_DIR}\n`);
});
