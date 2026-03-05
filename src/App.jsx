import { useState, useEffect } from "react";

import { useUniverses, useTemplates, usePlan, useDayData } from "./hooks";
import { getDay } from "./api/storage";
import { dateKey, getWeekDates } from "./constants/dates";
import { TabPuzzle, TabClipboard, TabCalendar, TabChart } from "./components/shared/Icons";
import Loader from "./components/shared/Loader";
import TemplatesView from "./components/templates/TemplatesView";
import DayView from "./components/day/DayView";
import PlanView from "./components/plan/PlanView";
import HistoryView from "./components/history/HistoryView";
import S from "./styles/theme";

/* ── Global CSS ── */
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
  { key: "blocos",        label: "Blocos",        Icon: TabPuzzle },
  { key: "planejamento",  label: "Planejamento",  Icon: TabClipboard },
  { key: "dia",           label: "Dia",           Icon: TabCalendar },
  { key: "historico",     label: "Histórico",     Icon: TabChart },
];

export default function App() {
  const [view, setView]       = useState("dia");
  const [curDate, setCurDate] = useState(new Date());

  /* ── Global state from API ── */
  const { universes, saveUniverses, loading: uniLoading }  = useUniverses();
  const { templates, saveTemplates, loading: tplLoading }   = useTemplates();
  const { plan, savePlan, loading: planLoading }             = usePlan();
  const { dayData, saveDay, loadDay, loading: dayLoading }            = useDayData(curDate, plan, templates);

  /* ── Week data (lazy for history) ── */
  const [weekData, setWeekData] = useState(null);

  useEffect(() => {
    if (view !== "historico") return;
    (async () => {
      const dates = getWeekDates(curDate);
      const result = {};
      for (const d of dates) {
        try {
          const data = await getDay(dateKey(d));
          result[dateKey(d)] = data || { rituals: [] };
        } catch {
          result[dateKey(d)] = { rituals: [] };
        }
      }
      setWeekData(result);
    })();
  }, [view, curDate]);

  /* ── Navigation ── */
  const navDay  = (n) => { const d = new Date(curDate); d.setDate(d.getDate() + n);     setCurDate(d); };
  const navWeek = (n) => { const d = new Date(curDate); d.setDate(d.getDate() + n * 7); setCurDate(d); };

  const globalLoading = uniLoading || tplLoading || planLoading;

  if (globalLoading) {
    return <div style={S.root}><Loader /></div>;
  }

  return (
    <div style={S.root}>
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
        {view === "blocos" && (
          <TemplatesView
            templates={templates}
            onSave={saveTemplates}
            universes={universes}
          />
        )}

        {view === "planejamento" && (
          <PlanView
            plan={plan}
            onSave={savePlan}
            templates={templates}
            universes={universes}
            onSaveUniverses={saveUniverses}
          />
        )}

        {view === "dia" && (
          <DayView
            date={curDate}
            dayData={dayData}
            universes={universes}
            loading={dayLoading}
            onNav={navDay}
            onSave={saveDay}
            onReloadDay={loadDay}
          />
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
