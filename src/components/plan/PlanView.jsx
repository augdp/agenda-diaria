import { useState } from "react";
import { Plus, Trash, Clock, Down, Gear } from "../shared/Icons";
import AddRitualForm from "../shared/AddRitualForm";
import AddActivityInline from "../shared/AddActivityInline";
import UniverseManager from "./UniverseManager";
import CopyDayDropdown from "./CopyDayDropdown";
import { DEFAULT_UNIVERSES } from "../../constants";
import { WEEKDAYS_SHORT, WEEKDAYS_FULL } from "../../constants/dates";
import { uid, deepClone } from "../../utils/helpers";
import S from "../../styles/theme";

export default function PlanView({ plan, onSave }) {
  const [selDay, setSelDay]         = useState(1); // Monday by default
  const [showUniMgr, setShowUniMgr] = useState(false);
  const [showAddRit, setShowAddRit] = useState(false);
  const [expandedRit, setExpandedRit] = useState(null);

  const universes = plan.universes || DEFAULT_UNIVERSES;
  const dayRits   = plan.days[selDay] || [];

  /* ── Helpers ── */
  const saveDayRits = (rits) => {
    onSave({ ...plan, days: { ...plan.days, [selDay]: rits } });
  };

  const saveUniverses = (u) => onSave({ ...plan, universes: u });

  const copyToDay = (targetDay) => {
    const copied = deepClone(dayRits).map((r) => ({
      ...r, id: uid(),
      activities: r.activities.map((a) => ({ ...a, id: uid() })),
    }));
    onSave({ ...plan, days: { ...plan.days, [targetDay]: copied } });
  };

  /* ── Ritual CRUD ── */
  const addRitual = (r) => {
    const rits = [...dayRits, { ...r, id: uid(), activities: [] }];
    rits.sort((a, b) => a.startTime.localeCompare(b.startTime));
    saveDayRits(rits);
    setShowAddRit(false);
  };

  const deleteRitual = (id) => {
    saveDayRits(dayRits.filter((r) => r.id !== id));
    if (expandedRit === id) setExpandedRit(null);
  };

  /* ── Activity CRUD ── */
  const addActivity = (rid, act) => {
    saveDayRits(
      dayRits.map((r) =>
        r.id === rid ? { ...r, activities: [...r.activities, { ...act, id: uid() }] } : r,
      ),
    );
  };

  const deleteActivity = (rid, aid) => {
    saveDayRits(
      dayRits.map((r) =>
        r.id === rid ? { ...r, activities: r.activities.filter((a) => a.id !== aid) } : r,
      ),
    );
  };

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>
      <header style={{ ...S.header, marginBottom: 8 }}>
        <p style={S.viewSubtitle}>Planejamento Semanal</p>
        <h2 style={S.viewTitle}>Defina a rotina padrão para cada dia</h2>
      </header>

      {/* Universe manager */}
      <button onClick={() => setShowUniMgr(!showUniMgr)} style={S.gearBtn}>
        <Gear /> Gerenciar universos
      </button>
      {showUniMgr && <UniverseManager universes={universes} onSave={saveUniverses} />}

      {/* Day tabs */}
      <div style={S.daySelector}>
        {WEEKDAYS_SHORT.map((d, i) => {
          const count = (plan.days[i] || []).length;
          return (
            <button key={i} onClick={() => setSelDay(i)} style={{ ...S.dayBtn, ...(selDay === i ? S.dayBtnOn : {}) }}>
              <span>{d}</span>
              {count > 0 && (
                <span style={{ ...S.dayBtnCount, background: selDay === i ? "#3E2F1C" : "#C8BDA8" }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Copy */}
      {dayRits.length > 0 && <CopyDayDropdown currentDay={selDay} onCopy={copyToDay} />}

      {/* Rituals */}
      <div style={{ marginTop: 12 }}>
        {dayRits.length === 0 && !showAddRit && (
          <div style={S.emptyPlan}>
            <div style={{ fontSize: 28, opacity: 0.35, marginBottom: 6 }}>📝</div>
            <p style={{ fontStyle: "italic", fontSize: 14, margin: "0 0 3px", color: "#8B7355" }}>
              Nenhum rito para {WEEKDAYS_FULL[selDay]}
            </p>
            <p style={{ fontSize: 11.5, fontFamily: "'DM Sans'", color: "#A89880", margin: 0 }}>
              Adicione ritos que serão o template deste dia
            </p>
          </div>
        )}

        {dayRits.map((rit) => {
          const univs = [...new Set(rit.activities.map((a) => a.universe))];
          const primary = univs[0] || "outro";
          const pal = universes[primary] || DEFAULT_UNIVERSES.outro;
          const isExp = expandedRit === rit.id;
          const totM = rit.activities.reduce((s, a) => s + a.duration, 0);

          return (
            <div
              key={rit.id}
              style={{
                ...S.planCard,
                borderLeftColor: pal.color,
                background: `linear-gradient(140deg, ${(pal.bg || pal.color + "22")}99 0%, #ffffff99 100%)`,
              }}
            >
              {/* Head */}
              <div style={S.planCardHead} onClick={() => setExpandedRit(isExp ? null : rit.id)}>
                <span style={{ ...S.planTime, color: pal.color }}>{rit.startTime}</span>
                <div style={{ flex: 1 }}>
                  <div style={S.planName}>{rit.name}</div>
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
                {totM > 0 && (
                  <span style={{ fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 600, color: "#A09478" }}>
                    {totM}min
                  </span>
                )}
                <span style={{ ...S.expandIcon, transform: isExp ? "rotate(180deg)" : "rotate(0)" }}>
                  <Down />
                </span>
                <button onClick={(e) => { e.stopPropagation(); deleteRitual(rit.id); }} style={{ ...S.iBtn, color: "#c58070" }}>
                  <Trash />
                </button>
              </div>

              {/* Activities */}
              {isExp && (
                <div style={S.actSection}>
                  {rit.activities.length === 0 && <p style={S.emptyAct}>Adicione as atividades deste rito</p>}
                  {rit.activities.map((act) => {
                    const au = universes[act.universe] || DEFAULT_UNIVERSES.outro;
                    return (
                      <div key={act.id} style={S.actRow}>
                        <span style={{ ...S.actTagBadge, background: au.color + "15", color: au.color }}>{au.emoji}</span>
                        <span style={S.actName}>{act.name}</span>
                        <span style={{ ...S.actDur, color: au.color }}><Clock /> {act.duration}m</span>
                        <button onClick={() => deleteActivity(rit.id, act.id)} style={{ ...S.iBtn, color: "#bbb" }}>
                          <Trash />
                        </button>
                      </div>
                    );
                  })}
                  <AddActivityInline onAdd={(a) => addActivity(rit.id, a)} accent={pal.color} universes={universes} />
                </div>
              )}
            </div>
          );
        })}

        {/* Add ritual */}
        {showAddRit ? (
          <AddRitualForm onAdd={addRitual} onCancel={() => setShowAddRit(false)} offset={0} />
        ) : (
          <button onClick={() => setShowAddRit(true)} style={{ ...S.addRitBtn, marginLeft: 0, maxWidth: "100%" }}>
            <Plus /> Adicionar rito padrão
          </button>
        )}
      </div>
    </div>
  );
}
