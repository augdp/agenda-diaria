import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Chevron } from "../shared/Icons";
import Loader from "../shared/Loader";
import { WEEKDAYS_SHORT } from "../../constants/dates";
import { dateKey, getWeekDates } from "../../constants/dates";
import { formatMinutes } from "../../utils/helpers";
import S from "../../styles/theme";

export default function HistoryView({ curDate, weekData, universes, onNav }) {
  const wDates = getWeekDates(curDate);
  const weekLabel = `${wDates[0].getDate()}/${wDates[0].getMonth() + 1} – ${wDates[6].getDate()}/${wDates[6].getMonth() + 1}`;

  /* ── Aggregate ── */
  const uMin = {};
  const dMin = {};
  Object.keys(universes).forEach((k) => { uMin[k] = 0; });

  let totalActs = 0;
  let doneActs = 0;

  if (weekData) {
    wDates.forEach((d, di) => {
      const dd = weekData[dateKey(d)] || { rituals: [] };
      dMin[di] = {};
      Object.keys(universes).forEach((k) => { dMin[di][k] = 0; });

      dd.rituals.forEach((r) =>
        r.activities.forEach((a) => {
          uMin[a.universe] = (uMin[a.universe] || 0) + a.duration;
          dMin[di][a.universe] = (dMin[di][a.universe] || 0) + a.duration;
          totalActs++;
          if (a.done) doneActs++;
        }),
      );
    });
  }

  const total = Object.values(uMin).reduce((s, v) => s + v, 0);
  const completionPct = totalActs > 0 ? Math.round((doneActs / totalActs) * 100) : 0;

  const pieData = Object.entries(universes)
    .filter(([k]) => uMin[k] > 0)
    .map(([k, v]) => ({ name: v.label, value: uMin[k], color: v.color, emoji: v.emoji }));

  const barData = wDates.map((d, i) => {
    const entry = { name: WEEKDAYS_SHORT[d.getDay()] };
    Object.entries(universes).forEach(([k, v]) => { entry[v.label] = dMin[i]?.[k] || 0; });
    return entry;
  });

  return (
    <div style={{ animation: "fadeUp 0.35s ease" }}>
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={S.navRow}>
          <button onClick={() => onNav(-1)} style={S.navBtn}><Chevron dir="left" /></button>
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={S.viewSubtitle}>Histórico Semanal</p>
            <h2 style={S.viewTitle}>{weekLabel}</h2>
          </div>
          <button onClick={() => onNav(1)} style={S.navBtn}><Chevron dir="right" /></button>
        </div>
      </header>

      {!weekData ? (
        <Loader />
      ) : total === 0 ? (
        <div style={S.emptyPlan}>
          <div style={{ fontSize: 32, opacity: 0.35, marginBottom: 8 }}>📊</div>
          <p style={{ fontStyle: "italic", fontSize: 15, margin: "0 0 4px", color: "#8B7355" }}>
            Nenhuma atividade esta semana
          </p>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 12, margin: 0, color: "#A89880" }}>
            Adicione atividades na visão diária
          </p>
        </div>
      ) : (
        <>
          {/* Completion */}
          <div style={S.completionBar}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11.5, fontFamily: "'DM Sans'", fontWeight: 600, color: "#6B5A42" }}>
                  Taxa de conclusão
                </span>
                <span
                  style={{
                    fontSize: 12, fontFamily: "'Fraunces'", fontWeight: 700,
                    color: completionPct >= 80 ? "#3E7A54" : completionPct >= 50 ? "#B8860B" : "#c58070",
                  }}
                >
                  {completionPct}%
                </span>
              </div>
              <div style={{ width: "100%", height: 6, background: "#E8E2D6", borderRadius: 10, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${completionPct}%`, height: "100%", borderRadius: 10,
                    transition: "width 0.5s",
                    background: completionPct >= 80 ? "#3E7A54" : completionPct >= 50 ? "#B8860B" : "#c58070",
                  }}
                />
              </div>
            </div>
            <span style={{ fontSize: 11, fontFamily: "'DM Sans'", color: "#A09478" }}>
              {doneActs}/{totalActs} atividades
            </span>
          </div>

          {/* Summary cards */}
          <div style={S.sumGrid}>
            {Object.entries(universes)
              .filter(([k]) => uMin[k] > 0)
              .map(([k, v]) => {
                const pct = Math.round((uMin[k] / total) * 100);
                return (
                  <div key={k} style={{ ...S.sumCard, borderLeftColor: v.color, background: (v.bg || v.color + "22") + "bb" }}>
                    <span style={{ fontSize: 20 }}>{v.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...S.sumLabel, color: v.color }}>{v.label}</div>
                      <div style={S.sumVal}>{formatMinutes(uMin[k])}</div>
                    </div>
                    <div style={{ ...S.sumPct, color: v.color }}>{pct}%</div>
                  </div>
                );
              })}
          </div>

          <div style={S.totalBar}><span>Total semanal</span><strong>{formatMinutes(total)}</strong></div>

          {/* Pie chart */}
          <div style={S.chartBox}>
            <h3 style={S.chartH}>Distribuição por Universo</h3>
            <div style={{ width: "100%", height: 210 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    innerRadius={50} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatMinutes(v)} contentStyle={S.ttStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={S.legend}>
              {pieData.map((p) => (
                <span key={p.name} style={S.legItem}>
                  <span style={{ ...S.legDot, background: p.color }} /> {p.emoji} {p.name}
                </span>
              ))}
            </div>
          </div>

          {/* Bar chart */}
          <div style={S.chartBox}>
            <h3 style={S.chartH}>Alocação Diária</h3>
            <div style={{ width: "100%", height: 210 }}>
              <ResponsiveContainer>
                <BarChart data={barData} barCategoryGap="18%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e2d6" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "'DM Sans'", fill: "#8B7355" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fontFamily: "'DM Sans'", fill: "#8B7355" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v > 0 ? `${v}m` : "")} />
                  <Tooltip formatter={(v) => `${v} min`} contentStyle={S.ttStyle} />
                  {Object.entries(universes)
                    .filter(([k]) => uMin[k] > 0)
                    .map(([k, v]) => (
                      <Bar key={k} dataKey={v.label} stackId="a" fill={v.color} radius={[2, 2, 0, 0]} />
                    ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
