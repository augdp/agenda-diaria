import { useState } from "react";
import { Trash, Down, Clock, Gear } from "../shared/Icons";
import UniverseManager from "./UniverseManager";
import CopyDayDropdown from "./CopyDayDropdown";
import { DEFAULT_UNIVERSES } from "../../constants";
import { WEEKDAYS_SHORT, WEEKDAYS_FULL } from "../../constants/dates";
import { uid, deepClone } from "../../utils/helpers";
import S from "../../styles/theme";

/**
 * Plan slots are now: { id, templateId, startTime }
 * The plan no longer stores activities inline — it references templates.
 */
export default function PlanView({ plan, onSave, templates, universes, onSaveUniverses }) {
  const [selDay, setSelDay]       = useState(1);
  const [showUniMgr, setShowUniMgr] = useState(false);
  const [showAdd, setShowAdd]     = useState(false);

  const u = universes || DEFAULT_UNIVERSES;
  const daySlots = plan.days[selDay] || [];

  /* ── Helpers ── */
  const saveDaySlots = (slots) => {
    onSave({ ...plan, days: { ...plan.days, [selDay]: slots } });
  };

  const copyToDay = (targetDay) => {
    const copied = deepClone(daySlots).map((s) => ({ ...s, id: uid() }));
    onSave({ ...plan, days: { ...plan.days, [targetDay]: copied } });
  };

  const addSlot = (templateId, startTime) => {
    const slots = [...daySlots, { id: uid(), templateId, startTime }];
    slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
    saveDaySlots(slots);
    setShowAdd(false);
  };

  const deleteSlot = (id) => {
    saveDaySlots(daySlots.filter((s) => s.id !== id));
  };

  const updateSlotTime = (id, startTime) => {
    const slots = daySlots.map((s) => (s.id === id ? { ...s, startTime } : s));
    slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
    saveDaySlots(slots);
  };

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>
      <header style={{ ...S.header, marginBottom: 8 }}>
        <p style={S.viewSubtitle}>Planejamento Semanal</p>
        <h2 style={S.viewTitle}>Atribua blocos a cada dia da semana</h2>
      </header>

      {/* Universe manager */}
      <button onClick={() => setShowUniMgr(!showUniMgr)} style={S.gearBtn}>
        <Gear /> Gerenciar universos
      </button>
      {showUniMgr && <UniverseManager universes={u} onSave={onSaveUniverses} />}

      {/* Day tabs */}
      <div style={S.daySelector}>
        {WEEKDAYS_SHORT.map((d, i) => {
          const count = (plan.days[i] || []).length;
          return (
            <button key={i} onClick={() => setSelDay(i)}
              style={{ ...S.dayBtn, ...(selDay === i ? S.dayBtnOn : {}) }}>
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

      {daySlots.length > 0 && <CopyDayDropdown currentDay={selDay} onCopy={copyToDay} />}

      {/* Slots */}
      <div style={{ marginTop: 12 }}>
        {daySlots.length === 0 && !showAdd && (
          <div style={S.emptyPlan}>
            <div style={{ fontSize: 28, opacity: 0.35, marginBottom: 6 }}>📝</div>
            <p style={{ fontStyle: "italic", fontSize: 14, margin: "0 0 3px", color: "#8B7355" }}>
              Nenhum bloco para {WEEKDAYS_FULL[selDay]}
            </p>
            <p style={{ fontSize: 11.5, fontFamily: "'DM Sans'", color: "#A89880", margin: 0 }}>
              Atribua blocos criados na aba "Blocos" a este dia
            </p>
          </div>
        )}

        {daySlots.map((slot) => {
          const tpl = templates.find((t) => t.id === slot.templateId);
          if (!tpl) {
            return (
              <div key={slot.id} style={{ ...ST.slotCard, borderLeftColor: "#ccc" }}>
                <div style={ST.slotHead}>
                  <span style={{ ...ST.slotTime, color: "#aaa" }}>{slot.startTime}</span>
                  <span style={{ flex: 1, fontStyle: "italic", color: "#aaa", fontSize: 13, fontFamily: "'DM Sans'" }}>
                    Bloco removido
                  </span>
                  <button onClick={() => deleteSlot(slot.id)} style={{ ...S.iBtn, color: "#c58070" }}>
                    <Trash />
                  </button>
                </div>
              </div>
            );
          }

          const univs = [...new Set(tpl.activities.map((a) => a.universe))];
          const primary = univs[0] || "outro";
          const pal = u[primary] || DEFAULT_UNIVERSES.outro;
          const totM = tpl.activities.reduce((s, a) => s + a.duration, 0);

          return (
            <div key={slot.id} style={{
              ...ST.slotCard,
              borderLeftColor: pal.color,
              background: `linear-gradient(140deg, ${(pal.bg || pal.color + "22")}99 0%, #ffffff99 100%)`,
            }}>
              <div style={ST.slotHead}>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => updateSlotTime(slot.id, e.target.value)}
                  style={ST.timeInput}
                  onClick={(e) => e.stopPropagation()}
                />
                <div style={{ flex: 1 }}>
                  <div style={ST.slotName}>🧩 {tpl.name}</div>
                  {univs.length > 0 && (
                    <div style={S.cardTags}>
                      {univs.map((k) => {
                        const uv = u[k] || DEFAULT_UNIVERSES.outro;
                        return (
                          <span key={k} style={{ ...S.uTag, background: uv.color + "14", color: uv.color }}>
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
                <button onClick={() => deleteSlot(slot.id)} style={{ ...S.iBtn, color: "#c58070" }}>
                  <Trash />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add slot */}
        {showAdd ? (
          <AddSlotForm
            templates={templates}
            onAdd={addSlot}
            onCancel={() => setShowAdd(false)}
          />
        ) : (
          <button onClick={() => setShowAdd(true)}
            style={{ ...S.addRitBtn, marginLeft: 0, maxWidth: "100%" }}>
            + Atribuir bloco
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Add Slot form: pick template + time ── */
function AddSlotForm({ templates, onAdd, onCancel }) {
  const [tplId, setTplId] = useState(templates[0]?.id || "");
  const [time, setTime]   = useState("08:00");

  if (templates.length === 0) {
    return (
      <div style={{ ...S.addRitCard, marginLeft: 0 }}>
        <p style={{ fontSize: 13, fontFamily: "'DM Sans'", color: "#8B7355", margin: 0 }}>
          Nenhum bloco disponível. Crie blocos na aba "Blocos" primeiro.
        </p>
        <button onClick={onCancel} style={{ ...S.cBtn, marginTop: 10 }}>Fechar</button>
      </div>
    );
  }

  return (
    <div style={{ ...S.addRitCard, marginLeft: 0 }}>
      <div style={S.formTitle}>Atribuir Bloco ao Dia</div>
      <div style={{ display: "flex", gap: 10 }}>
        <div>
          <label style={S.fl}>Horário</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            style={{ ...S.fi, width: 115 }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={S.fl}>Bloco</label>
          <select value={tplId} onChange={(e) => setTplId(e.target.value)} style={{ ...S.fs, width: "100%" }}>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>🧩 {t.name} ({t.activities.length} atividades)</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 12 }}>
        <button onClick={onCancel} style={S.cBtn}>Cancelar</button>
        <button onClick={() => tplId && onAdd(tplId, time)}
          style={{ ...S.sBtn, background: "#3E2F1C" }}>Atribuir</button>
      </div>
    </div>
  );
}

/* ── Local styles ── */
const ST = {
  slotCard: {
    borderLeft: "4px solid #999", borderRadius: "0 12px 12px 0",
    marginBottom: 8, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
  },
  slotHead: {
    display: "flex", alignItems: "center", gap: 10, padding: "11px 12px",
  },
  slotName: { fontSize: 14, fontWeight: 700, color: "#3E2F1C" },
  slotTime: { fontSize: 13, fontFamily: "'DM Sans'", fontWeight: 700, minWidth: 44 },
  timeInput: {
    border: "1.5px solid #D4CCB8", borderRadius: 8, padding: "5px 8px",
    fontSize: 13, fontFamily: "'DM Sans'", fontWeight: 700,
    background: "rgba(255,255,255,0.5)", outline: "none", color: "#3E2F1C",
    width: 100,
  },
};
