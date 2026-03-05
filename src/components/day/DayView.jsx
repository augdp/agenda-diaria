import { useState } from "react";
import { Chevron, Plus } from "../shared/Icons";
import Loader from "../shared/Loader";
import AddRitualForm from "../shared/AddRitualForm";
import RitualCard from "./RitualCard";
import { HOURS } from "../../constants";
import { formatDateFull, dateKey } from "../../constants/dates";
import { uid, timeToMinutes } from "../../utils/helpers";
import S from "../../styles/theme";
import { deleteDay } from "../../api/storage";

export default function DayView({ date, dayData, universes, loading, onNav, onSave, onReloadDay }) {
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd]   = useState(false);

  const isToday = dateKey(new Date()) === dateKey(date);
  const data = dayData || { rituals: [] };

  /* ── Mutations ── */
  const addRitual = (r) => {
    const updated = { ...data, rituals: [...data.rituals, { ...r, id: uid(), activities: [], notes: "" }] };
    updated.rituals.sort((a, b) => a.startTime.localeCompare(b.startTime));
    onSave(updated);
    setShowAdd(false);
  };

  const deleteRitual = (id) => {
    onSave({ ...data, rituals: data.rituals.filter((r) => r.id !== id) });
    if (expanded === id) setExpanded(null);
  };

  const regenerateDay = async () => {
    const d = dateKey(date);

    await deleteDay(d);

    onReloadDay();
  };

  const updateNotes = (id, notes) => {
    onSave({ ...data, rituals: data.rituals.map((r) => (r.id === id ? { ...r, notes } : r)) });
  };

  const addActivity = (rid, act) => {
    onSave({
      ...data,
      rituals: data.rituals.map((r) =>
        r.id === rid ? { ...r, activities: [...r.activities, { ...act, id: uid(), done: false }] } : r,
      ),
    });
  };

  const toggleActivity = (rid, aid) => {
    onSave({
      ...data,
      rituals: data.rituals.map((r) =>
        r.id === rid
          ? { ...r, activities: r.activities.map((a) => (a.id === aid ? { ...a, done: !a.done } : a)) }
          : r,
      ),
    });
  };

  const deleteActivity = (rid, aid) => {
    onSave({
      ...data,
      rituals: data.rituals.map((r) =>
        r.id === rid ? { ...r, activities: r.activities.filter((a) => a.id !== aid) } : r,
      ),
    });
  };

  /* ── Group rituals by hour ── */
  const ritsByHour = {};
  HOURS.forEach((h) => { ritsByHour[h] = []; });
  data.rituals.forEach((r) => {
    const h = Math.floor(timeToMinutes(r.startTime) / 60);
    if (ritsByHour[h]) ritsByHour[h].push(r);
  });

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>
      {/* ── Header ── */}
      <header style={S.header}>
        <div style={S.navRow}>
          <button onClick={() => onNav(-1)} style={S.navBtn}><Chevron dir="left" /></button>
          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 style={S.dateTitle}>{formatDateFull(date)}</h1>
            <button
              onClick={regenerateDay}
              style={{
                marginTop: 6,
                fontSize: 12,
                opacity: 0.6,
                cursor: "pointer",
                background: "none",
                border: "none"
              }}
            >
              regerar dia
            </button>
            {isToday && <span style={S.badge}>hoje</span>}
          </div>
          <button onClick={() => onNav(1)} style={S.navBtn}><Chevron dir="right" /></button>
        </div>
      </header>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* ── Timeline ── */}
          <div style={S.timeline}>
            <div style={S.rulerTrack} />

            {HOURS.map((h, hi) => {
              const hasR = ritsByHour[h].length > 0;
              return (
                <div key={h} style={S.hourRow}>
                  {/* Hour label */}
                  <div style={S.hourLabel}>
                    <span style={{ ...S.hourText, color: hasR ? "#6B5A42" : "#C0B8A6" }}>
                      {String(h).padStart(2, "0")}
                    </span>
                    <span style={{ ...S.hourMin, color: hasR ? "#A09478" : "#D8D0C0" }}>00</span>
                  </div>

                  {/* Dot */}
                  <div style={S.dotCol}>
                    <div style={{
                      ...S.dot,
                      background: hasR ? "#6B5A42" : "#D8D0C0",
                      width: hasR ? 10 : 6,
                      height: hasR ? 10 : 6,
                    }} />
                  </div>

                  {/* Ritual cards */}
                  <div style={S.hourContent}>
                    {ritsByHour[h].map((rit, ri) => (
                      <RitualCard
                        key={rit.id}
                        ritual={rit}
                        universes={universes}
                        isExpanded={expanded === rit.id}
                        onToggleExpand={() => setExpanded(expanded === rit.id ? null : rit.id)}
                        onDelete={() => deleteRitual(rit.id)}
                        onUpdateNotes={(notes) => updateNotes(rit.id, notes)}
                        onAddActivity={(a) => addActivity(rit.id, a)}
                        onToggleActivity={(aid) => toggleActivity(rit.id, aid)}
                        onDeleteActivity={(aid) => deleteActivity(rit.id, aid)}
                        animationDelay={`${hi * 30 + ri * 50}ms`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Add ritual ── */}
          {showAdd ? (
            <AddRitualForm onAdd={addRitual} onCancel={() => setShowAdd(false)} offset={64} />
          ) : (
            <button onClick={() => setShowAdd(true)} style={S.addRitBtn}>
              <Plus /> Adicionar rito
            </button>
          )}
        </>
      )}
    </div>
  );
}
