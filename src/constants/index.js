// ─── Timeline ───
export const HOURS = Array.from({ length: 18 }, (_, i) => i + 5); // 05h – 22h

// ─── Duration options (minutes) ───
export const DURATION_OPTIONS = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75];

// ─── Default universes (seed for first run) ───
export const DEFAULT_UNIVERSES = {
  faculdade:   { label: "Faculdade",        emoji: "📚", color: "#3A7BBF", bg: "#DDEAF7" },
  auditoria:   { label: "Auditoria",        emoji: "📋", color: "#B8860B", bg: "#F5EDCF" },
  concursos:   { label: "Concursos",        emoji: "🎯", color: "#9B4DCA", bg: "#EEDDF7" },
  atencao:     { label: "Ritos Humanos",    emoji: "🐾", color: "#D4567A", bg: "#F9DFE8" },
  outro:       { label: "Outro",            emoji: "✦",  color: "#6B8A6B", bg: "#E0EDE4" },
};

// ─── Preset colors for universe editor ───
export const PRESET_COLORS = [
  "#3A7BBF", "#B8860B", "#9B4DCA", "#C06030", "#D4567A",
  "#6B8A6B", "#2E8B8B", "#8B4513", "#556B2F", "#8B008B",
];

// ─── Empty structures ───
export const emptyPlan = () => ({
  days: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
});

/**
 * Data shapes reference:
 *
 * Template:
 * { id, name, activities: [{ id, name, duration, universe }] }
 *
 * Plan slot (in plan.days[dow]):
 * { id, templateId, startTime }
 *
 * Day ritual (materialized in days/YYYY-MM-DD.json):
 * { id, templateId, name, startTime, notes, activities: [{ id, name, duration, universe, done }] }
 */
