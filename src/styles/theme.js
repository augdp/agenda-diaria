/**
 * Centralised style objects.
 *
 * We keep them as plain JS objects (not CSS-in-JS) because the app
 * renders inside Claude's artifact sandbox that only supports inline
 * styles and Tailwind utility classes.
 */

const S = {
  /* ── Layout ── */
  root: {
    minHeight: "100vh",
    background: "linear-gradient(175deg, #FDFAF4 0%, #F4EFE5 45%, #EBE5D8 100%)",
    fontFamily: "'Fraunces', Georgia, serif",
  },
  shell: { maxWidth: 700, margin: "0 auto", padding: "18px 14px 80px" },

  /* ── Tab bar ── */
  tabBar: { display: "flex", gap: 2, marginBottom: 18, background: "#E4DED2", borderRadius: 13, padding: 3 },
  tab: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
    padding: "10px 0", border: "none", borderRadius: 10, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 600,
    color: "#8B7355", background: "transparent", transition: "all 0.2s",
  },
  tabOn: {
    background: "#FDFAF4", color: "#3E2F1C",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
  },

  /* ── Header / navigation ── */
  header: { textAlign: "center", marginBottom: 14 },
  navRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10 },
  navBtn: {
    width: 34, height: 34, borderRadius: "50%", border: "1.5px solid #D4CCB8",
    background: "rgba(255,255,255,0.45)", cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", color: "#8B7355", flexShrink: 0,
  },
  dateTitle: { fontSize: 19, fontWeight: 700, color: "#3E2F1C", margin: 0, fontStyle: "italic" },
  badge: {
    display: "inline-block", marginTop: 4, fontSize: 8.5, fontFamily: "'DM Sans'",
    fontWeight: 700, textTransform: "uppercase", letterSpacing: 2,
    background: "#3E7A54", color: "#fff", padding: "2px 9px", borderRadius: 20,
  },
  viewSubtitle: {
    margin: 0, fontSize: 10, fontFamily: "'DM Sans'", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: 2.5, color: "#A09478",
  },
  viewTitle: {
    margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#3E2F1C",
    fontStyle: "italic", fontFamily: "'Fraunces'",
  },

  /* ── Timeline (day view) ── */
  timeline: { position: "relative", paddingLeft: 0 },
  rulerTrack: {
    position: "absolute", left: 52, top: 12, bottom: 0, width: 2,
    background: "linear-gradient(180deg, #D8D0C0 0%, #E8E2D6 100%)", borderRadius: 2,
  },
  hourRow: { display: "flex", alignItems: "flex-start", minHeight: 56, position: "relative" },
  hourLabel: {
    width: 40, flexShrink: 0, textAlign: "right", paddingRight: 6, paddingTop: 1,
    display: "flex", flexDirection: "column", alignItems: "flex-end",
  },
  hourText: { fontSize: 14, fontFamily: "'Fraunces', serif", fontWeight: 700, lineHeight: 1 },
  hourMin: { fontSize: 8, fontFamily: "'DM Sans'", fontWeight: 600, letterSpacing: 1 },
  dotCol: {
    width: 24, flexShrink: 0, display: "flex", justifyContent: "center",
    paddingTop: 5, position: "relative", zIndex: 1,
  },
  dot: { borderRadius: "50%", transition: "all 0.2s" },
  hourContent: { flex: 1, paddingLeft: 8, paddingBottom: 4 },

  /* ── Ritual card ── */
  card: {
    borderLeft: "4px solid #999", borderRadius: "0 14px 14px 0",
    marginBottom: 6, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.035)",
    animation: "slideR 0.3s ease both", backdropFilter: "blur(4px)",
  },
  cardHead: { display: "flex", alignItems: "center", gap: 8, padding: "11px 12px", cursor: "pointer" },
  cardLeft: { flex: 1, display: "flex", alignItems: "center", gap: 10 },
  cardTimeBadge: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: 44 },
  cardTime: { fontSize: 13, fontFamily: "'DM Sans'", fontWeight: 700 },
  cardDurLabel: { fontSize: 8.5, fontFamily: "'DM Sans'", fontWeight: 600, color: "#A09478", marginTop: 1 },
  cardName: { fontSize: 14.5, fontWeight: 700, color: "#3E2F1C", lineHeight: 1.2 },
  cardTags: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 3 },
  uTag: { fontSize: 9.5, fontFamily: "'DM Sans'", fontWeight: 600, padding: "1px 7px", borderRadius: 5 },
  cardRight: { display: "flex", alignItems: "center", gap: 5, flexShrink: 0 },
  expandIcon: { color: "#A09478", transition: "transform 0.25s ease", display: "flex" },

  /* ── Notes panel ── */
  notesPanel: { padding: "0 14px 10px", borderTop: "1px solid rgba(0,0,0,0.04)", animation: "fadeUp 0.2s ease" },
  notesLabel: {
    display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontFamily: "'DM Sans'",
    fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#A09478", margin: "8px 0 6px",
  },
  notesArea: {
    width: "100%", border: "1.5px solid #D4CCB8", borderRadius: 10, padding: "10px 12px",
    fontSize: 12.5, fontFamily: "'DM Sans'", background: "rgba(255,255,255,0.5)",
    outline: "none", color: "#3E2F1C", boxSizing: "border-box", lineHeight: 1.5, minHeight: 60,
  },

  /* ── Activities ── */
  actSection: { padding: "0 12px 10px", borderTop: "1px solid rgba(0,0,0,0.05)", animation: "fadeUp 0.2s ease" },
  emptyAct: {
    fontSize: 12, fontFamily: "'DM Sans'", color: "#A89880",
    fontStyle: "italic", margin: "8px 0 4px", textAlign: "center",
  },
  actRow: {
    display: "flex", alignItems: "center", gap: 7, padding: "7px 0",
    borderBottom: "1px solid rgba(0,0,0,0.03)", transition: "opacity 0.2s",
  },
  ckbox: {
    width: 19, height: 19, borderRadius: 5, border: "2px solid #999",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, color: "#fff", transition: "all 0.15s", background: "transparent",
  },
  actName: { flex: 1, fontSize: 12.5, fontFamily: "'DM Sans'", fontWeight: 500, color: "#3E2F1C" },
  actDur: {
    fontSize: 10.5, fontFamily: "'DM Sans'", fontWeight: 600,
    display: "flex", alignItems: "center", gap: 2, flexShrink: 0,
  },
  actTagBadge: { fontSize: 11, padding: "1px 5px", borderRadius: 4, flexShrink: 0 },
  iBtn: {
    background: "none", border: "none", cursor: "pointer", padding: 3,
    display: "flex", alignItems: "center", borderRadius: 4,
  },

  addActBtn: {
    display: "flex", alignItems: "center", gap: 5, background: "none", border: "none",
    cursor: "pointer", padding: "7px 0", fontFamily: "'DM Sans'", fontSize: 11.5, fontWeight: 600, opacity: 0.55,
  },
  addActForm: { padding: "8px 0", display: "flex", flexDirection: "column", gap: 7, animation: "fadeUp 0.2s ease" },

  /* ── Add ritual ── */
  addRitBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
    width: "100%", padding: 13, marginTop: 8, marginLeft: 64, maxWidth: "calc(100% - 64px)",
    background: "rgba(255,255,255,0.35)", border: "2px dashed #C8BDA8",
    borderRadius: 12, cursor: "pointer", color: "#8B7355",
    fontFamily: "'DM Sans'", fontSize: 12.5, fontWeight: 600,
  },
  addRitCard: {
    background: "rgba(255,255,255,0.55)", border: "2px solid #D4CCB8",
    borderRadius: 14, padding: 16, marginTop: 8, backdropFilter: "blur(6px)",
  },

  /* ── Form primitives ── */
  formTitle: {
    fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: 2, color: "#8B7355", marginBottom: 10,
  },
  fl: {
    display: "block", fontSize: 9, fontFamily: "'DM Sans'", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: 1.5, color: "#A09478", marginBottom: 3,
  },
  fi: {
    width: "100%", border: "1.5px solid #D4CCB8", borderRadius: 8, padding: "7px 11px",
    fontSize: 12.5, fontFamily: "'DM Sans'", background: "rgba(255,255,255,0.55)",
    outline: "none", color: "#3E2F1C", boxSizing: "border-box",
  },
  fs: {
    border: "1.5px solid #D4CCB8", borderRadius: 8, padding: "7px 8px",
    fontSize: 11.5, fontFamily: "'DM Sans'", background: "rgba(255,255,255,0.55)",
    outline: "none", color: "#3E2F1C", boxSizing: "border-box",
  },
  cBtn: {
    padding: "7px 14px", background: "transparent", border: "1.5px solid #D4CCB8",
    borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans'", fontSize: 11.5, fontWeight: 600, color: "#8B7355",
  },
  sBtn: {
    padding: "7px 18px", border: "none", borderRadius: 8, cursor: "pointer",
    fontFamily: "'DM Sans'", fontSize: 11.5, fontWeight: 700, color: "#fff",
    transition: "all 0.2s", display: "flex", alignItems: "center", gap: 4,
  },

  /* ── Plan view ── */
  gearBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(255,255,255,0.4)", border: "1.5px solid #D4CCB8",
    borderRadius: 10, padding: "8px 14px", cursor: "pointer",
    fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: "#6B5A42",
    marginBottom: 10, transition: "all 0.15s",
  },
  daySelector: { display: "flex", gap: 4, marginBottom: 6, background: "#E8E2D4", borderRadius: 11, padding: 3 },
  dayBtn: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
    padding: "8px 0", border: "none", borderRadius: 8, cursor: "pointer",
    fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600, color: "#8B7355",
    background: "transparent", transition: "all 0.15s", position: "relative",
  },
  dayBtnOn: { background: "#FDFAF4", color: "#3E2F1C", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  dayBtnCount: { fontSize: 8, fontWeight: 700, color: "#fff", borderRadius: 10, padding: "1px 5px", marginTop: 1 },

  emptyPlan: { textAlign: "center", padding: "40px 20px" },

  planCard: {
    borderLeft: "4px solid #999", borderRadius: "0 12px 12px 0",
    marginBottom: 8, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
  },
  planCardHead: { display: "flex", alignItems: "center", gap: 8, padding: "11px 12px", cursor: "pointer" },
  planTime: { fontSize: 13, fontFamily: "'DM Sans'", fontWeight: 700, minWidth: 44, flexShrink: 0 },
  planName: { fontSize: 14, fontWeight: 700, color: "#3E2F1C" },

  copyBtn: {
    display: "flex", alignItems: "center", gap: 6, background: "none",
    border: "1.5px dashed #C8BDA8", borderRadius: 8, padding: "6px 12px", cursor: "pointer",
    fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600, color: "#8B7355",
  },
  copyDropdown: {
    position: "absolute", top: "100%", left: 0, marginTop: 4,
    background: "#fff", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    border: "1px solid #e0dbd2", zIndex: 10, overflow: "hidden", minWidth: 160,
  },
  copyItem: {
    display: "block", width: "100%", padding: "9px 14px", border: "none", background: "none",
    cursor: "pointer", fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 500, color: "#3E2F1C",
    textAlign: "left", borderBottom: "1px solid #f0ebe0",
  },

  /* ── Universe manager ── */
  uniMgr: {
    background: "rgba(255,255,255,0.5)", border: "1.5px solid #D4CCB8", borderRadius: 12,
    padding: 14, marginBottom: 14, animation: "fadeUp 0.2s ease",
  },
  uniTitle: {
    margin: "0 0 10px", fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: 2, color: "#8B7355",
  },
  uniList: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 },
  uniItem: {
    display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
    background: "rgba(255,255,255,0.5)", borderRadius: 8, borderLeft: "3px solid #999",
  },
  uniAddRow: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },

  /* ── History view ── */
  completionBar: {
    display: "flex", alignItems: "center", gap: 14,
    padding: "12px 14px", background: "rgba(255,255,255,0.45)", borderRadius: 11,
    marginBottom: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
  },
  sumGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 },
  sumCard: {
    display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
    borderRadius: 11, borderLeft: "4px solid #999", boxShadow: "0 1px 5px rgba(0,0,0,0.035)",
  },
  sumLabel: { fontSize: 10.5, fontFamily: "'DM Sans'", fontWeight: 700 },
  sumVal: { fontSize: 15, fontWeight: 700, color: "#3E2F1C", fontFamily: "'Fraunces'" },
  sumPct: { marginLeft: "auto", fontSize: 18, fontFamily: "'Fraunces'", fontWeight: 700, opacity: 0.65 },
  totalBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "8px 14px", background: "rgba(255,255,255,0.35)", borderRadius: 9,
    fontFamily: "'DM Sans'", fontSize: 12, color: "#6B5A42", marginBottom: 16,
  },
  chartBox: {
    background: "rgba(255,255,255,0.45)", borderRadius: 14, padding: "16px 12px",
    marginBottom: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
  },
  chartH: {
    fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 700, textTransform: "uppercase",
    letterSpacing: 2, color: "#8B7355", margin: "0 0 12px", textAlign: "center",
  },
  legend: { display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 8 },
  legItem: {
    display: "flex", alignItems: "center", gap: 4, fontSize: 10.5,
    fontFamily: "'DM Sans'", fontWeight: 500, color: "#6B5A42",
  },
  legDot: { width: 7, height: 7, borderRadius: "50%", display: "inline-block" },
  ttStyle: {
    fontFamily: "'DM Sans'", fontSize: 11, borderRadius: 10,
    border: "1px solid #e0dbd2", boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
};

export default S;
