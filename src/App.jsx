import { useState, useEffect } from "react";

import { usePlan, useDayData } from "./hooks";
import { STORAGE_PREFIX } from "./constants";
import { dateKey, getWeekDates } from "./constants/dates";
import { TabClipboard, TabCalendar, TabChart } from "./components/shared/Icons";
import Loader from "./components/shared/Loader";
import DayView from "./components/day/DayView";
import PlanView from "./components/plan/PlanView";
import HistoryView from "./components/history/HistoryView";
import S from "./styles/theme";

/* ── Global CSS (animations + scrollbar) ── */
const GLOBAL_CSS = `
  @keyframes spin    { to { transform: rotate(360deg) } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
  @keyframes slideR  { from { opacity:0; transform:translateX(-12px) } to { opacity:1; transform:translateX(0) } }
  * { box-sizing: border-box; }
  ::-webkit-scrollbar       { width: 4px }
  ::-webkit-scrollbar-thumb { background: #C8BDA8; border-radius: 10px }
  input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.4) }
  textarea { resize: vertical }
`;

const TABS = [
  { key: "planejamento", label: "Planejamento", Icon: TabClipboard },
  { key: "dia",          label: "Dia",          Icon: TabCalendar },
  { key: "historico",    label: "Histórico",    Icon: TabChart },
];

export default function App() {
  const [view, setView]       = useState("dia");
  const [curDate, setCurDate] = useState(new Date());

  /* ── Plan (weekly template + universes) ── */
  const { plan, savePlan, loading: planLoading, universes } = usePlan();

  /* ── Day data (bootstraps from plan on first visit) ── */
  const { dayData, saveDay, loading: dayLoading } = useDayData(curDate, plan);

  /* ── Week data (loaded lazily for history tab) ── */
  const [weekData, setWeekData] = useState(null);

  useEffect(() => {
    if (view !== "historico") return;
    (async () => {
      const dates = getWeekDates(curDate);
      const result = {};
      for (const d of dates) {
        const k = `${STORAGE_PREFIX}:${dateKey(d)}`;
        try {
          const r = await window.storage.get(k);
          result[dateKey(d)] = r ? JSON.parse(r.value) : { rituals: [] };
        } catch {
          result[dateKey(d)] = { rituals: [] };
        }
      }
      setWeekData(result);
    })();
  }, [view, curDate]);

  /* ── Navigation helpers ── */
  const navDay  = (n) => { const d = new Date(curDate); d.setDate(d.getDate() + n);       setCurDate(d); };
  const navWeek = (n) => { const d = new Date(curDate); d.setDate(d.getDate() + n * 7);   setCurDate(d); };

  if (planLoading) {
    return <div style={S.root}><Loader /></div>;
  }

  return (
    <div style={S.root}>
      {/* Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap"
        rel="stylesheet"
      />
      <style>{GLOBAL_CSS}</style>

      <div style={S.shell}>
        {/* ── Tab bar ── */}
        <div style={S.tabBar}>
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              style={{ ...S.tab, ...(view === key ? S.tabOn : {}) }}
            >
              <Icon /> <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ── Views ── */}
        {view === "dia" && (
          <DayView
            date={curDate}
            dayData={dayData}
            universes={universes}
            loading={dayLoading}
            onNav={navDay}
            onSave={saveDay}
          />
        )}

        {view === "planejamento" && (
          <PlanView plan={plan} onSave={savePlan} />
        )}

        {view === "historico" && (
          <HistoryView
            curDate={curDate}
            weekData={weekData}
            universes={universes}
            onNav={navWeek}
          />
        )}
      </div>
    </div>
  );
}
