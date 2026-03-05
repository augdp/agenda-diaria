import { useState } from "react";
import { Trash, Check, Clock, Down, Note } from "../shared/Icons";
import AddActivityInline from "../shared/AddActivityInline";
import NotesPanel from "./NotesPanel";
import { DEFAULT_UNIVERSES } from "../../constants";
import S from "../../styles/theme";

export default function RitualCard({
  ritual,
  universes,
  isExpanded,
  onToggleExpand,
  onDelete,
  onUpdateNotes,
  onAddActivity,
  onToggleActivity,
  onDeleteActivity,
  animationDelay = "0ms",
}) {
  const [notesOpen, setNotesOpen] = useState(false);

  const totM   = ritual.activities.reduce((s, a) => s + a.duration, 0);
  const doneM  = ritual.activities.filter((a) => a.done).reduce((s, a) => s + a.duration, 0);
  const pct    = totM > 0 ? Math.round((doneM / totM) * 100) : 0;
  const allDone = totM > 0 && doneM === totM;

  const univs   = [...new Set(ritual.activities.map((a) => a.universe))];
  const primary  = univs[0] || "outro";
  const pal      = universes[primary] || DEFAULT_UNIVERSES.outro;
  const hasNotes = ritual.notes && ritual.notes.trim().length > 0;

  return (
    <div
      style={{
        ...S.card,
        borderLeftColor: pal.color,
        background: `linear-gradient(140deg, ${pal.bg}dd 0%, #ffffffcc 100%)`,
        animationDelay,
      }}
    >
      {/* ── Header ── */}
      <div style={S.cardHead} onClick={onToggleExpand}>
        <div style={S.cardLeft}>
          <div style={S.cardTimeBadge}>
            <span style={{ ...S.cardTime, color: pal.color }}>{ritual.startTime}</span>
            {totM > 0 && <span style={S.cardDurLabel}>{totM}min</span>}
          </div>
          <div>
            <div
              style={{
                ...S.cardName,
                textDecoration: allDone ? "line-through" : "none",
                opacity: allDone ? 0.5 : 1,
              }}
            >
              {ritual.name}
              {allDone ? " ✓" : ""}
            </div>
            {univs.length > 0 && (
              <div style={S.cardTags}>
                {univs.map((u) => {
                  const uv = universes[u] || DEFAULT_UNIVERSES.outro;
                  return (
                    <span key={u} style={{ ...S.uTag, background: uv.color + "14", color: uv.color }}>
                      {uv.emoji} {uv.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={S.cardRight}>
          {totM > 0 && <ProgressRing pct={pct} color={pal.color} />}
          <button
            onClick={(e) => { e.stopPropagation(); setNotesOpen(!notesOpen); }}
            style={{ ...S.iBtn, color: hasNotes ? pal.color : "#bbb", position: "relative" }}
            title="Notas"
          >
            <Note />
            {hasNotes && (
              <span style={{
                position: "absolute", top: -2, right: -2,
                width: 6, height: 6, borderRadius: "50%", background: pal.color,
              }} />
            )}
          </button>
          <span style={{ ...S.expandIcon, transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>
            <Down />
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{ ...S.iBtn, color: "#c58070" }}
          >
            <Trash />
          </button>
        </div>
      </div>

      {/* ── Notes ── */}
      {notesOpen && (
        <NotesPanel value={ritual.notes} onChange={onUpdateNotes} accentColor={pal.color} />
      )}

      {/* ── Activities ── */}
      {isExpanded && (
        <div style={S.actSection}>
          {ritual.activities.length === 0 && (
            <p style={S.emptyAct}>Nenhuma atividade — adicione abaixo</p>
          )}
          {ritual.activities.map((act) => {
            const au = universes[act.universe] || DEFAULT_UNIVERSES.outro;
            return (
              <div key={act.id} style={{ ...S.actRow, opacity: act.done ? 0.4 : 1 }}>
                <button
                  onClick={() => onToggleActivity(act.id)}
                  style={{
                    ...S.ckbox,
                    borderColor: au.color,
                    background: act.done ? au.color : "transparent",
                  }}
                >
                  {act.done && <Check />}
                </button>
                <span style={{ ...S.actName, textDecoration: act.done ? "line-through" : "none" }}>
                  {act.name}
                </span>
                <span style={{ ...S.actDur, color: au.color }}><Clock /> {act.duration}m</span>
                <span style={{ ...S.actTagBadge, background: au.color + "12", color: au.color }}>
                  {au.emoji}
                </span>
                <button onClick={() => onDeleteActivity(act.id)} style={{ ...S.iBtn, color: "#bbb" }}>
                  <Trash />
                </button>
              </div>
            );
          })}
          <AddActivityInline onAdd={onAddActivity} accent={pal.color} universes={universes} />
        </div>
      )}
    </div>
  );
}

/* ── Tiny circular progress ── */
function ProgressRing({ pct, color }) {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" fill="none" stroke="#e8e2d6" strokeWidth="3" />
      <circle
        cx="18" cy="18" r="14" fill="none" stroke={color}
        strokeWidth="3" strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * 87.96} 87.96`}
        transform="rotate(-90 18 18)"
        style={{ transition: "stroke-dasharray 0.5s" }}
      />
      <text
        x="18" y="19" textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 8.5, fontFamily: "'DM Sans'", fontWeight: 700, fill: color }}
      >
        {pct}%
      </text>
    </svg>
  );
}
