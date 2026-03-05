import { useState, useRef, useEffect } from "react";
import { Plus, Trash, Clock, Down, Edit } from "../shared/Icons";
import AddActivityInline from "../shared/AddActivityInline";
import { DEFAULT_UNIVERSES } from "../../constants";
import { uid } from "../../utils/helpers";
import S from "../../styles/theme";

export default function TemplatesView({ templates, onSave, universes }) {
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [editing, setEditing]   = useState(null); // template id being renamed
  const [editName, setEditName] = useState("");

  const u = universes || DEFAULT_UNIVERSES;

  /* ── CRUD ── */
  const addTemplate = (name) => {
    const tpl = { id: uid(), name, activities: [] };
    onSave([...templates, tpl]);
    setShowAdd(false);
    setExpanded(tpl.id);
  };

  const deleteTemplate = (id) => {
    onSave(templates.filter((t) => t.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const renameTemplate = (id) => {
    if (!editName.trim()) return;
    onSave(templates.map((t) => (t.id === id ? { ...t, name: editName.trim() } : t)));
    setEditing(null);
  };

  const addActivity = (tplId, act) => {
    onSave(
      templates.map((t) =>
        t.id === tplId
          ? { ...t, activities: [...t.activities, { ...act, id: uid() }] }
          : t,
      ),
    );
  };

  const deleteActivity = (tplId, actId) => {
    onSave(
      templates.map((t) =>
        t.id === tplId
          ? { ...t, activities: t.activities.filter((a) => a.id !== actId) }
          : t,
      ),
    );
  };

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>
      <header style={{ ...S.header, marginBottom: 8 }}>
        <p style={S.viewSubtitle}>Blocos Reutilizáveis</p>
        <h2 style={S.viewTitle}>Defina os ritos que compõem sua rotina</h2>
      </header>

      <p style={ST.hint}>
        Cada bloco é um template de rito. Edite aqui e todas as futuras instâncias
        na semana serão atualizadas.
      </p>

      {templates.length === 0 && !showAdd && (
        <div style={S.emptyPlan}>
          <div style={{ fontSize: 28, opacity: 0.35, marginBottom: 6 }}>🧩</div>
          <p style={{ fontStyle: "italic", fontSize: 14, margin: "0 0 3px", color: "#8B7355" }}>
            Nenhum bloco criado
          </p>
          <p style={{ fontSize: 11.5, fontFamily: "'DM Sans'", color: "#A89880", margin: 0 }}>
            Crie blocos como "Rotina Matinal" ou "Bloco 2M3" com suas atividades
          </p>
        </div>
      )}

      {/* Template list */}
      {templates.map((tpl) => {
        const isExp = expanded === tpl.id;
        const univs = [...new Set(tpl.activities.map((a) => a.universe))];
        const primary = univs[0] || "outro";
        const pal = u[primary] || DEFAULT_UNIVERSES.outro;
        const totM = tpl.activities.reduce((s, a) => s + a.duration, 0);
        const isEditing = editing === tpl.id;

        return (
          <div
            key={tpl.id}
            style={{
              ...ST.card,
              borderLeftColor: pal.color,
              background: `linear-gradient(140deg, ${(pal.bg || pal.color + "22")}99 0%, #ffffff99 100%)`,
            }}
          >
            {/* Header */}
            <div style={ST.cardHead} onClick={() => setExpanded(isExp ? null : tpl.id)}>
              <span style={ST.cardEmoji}>🧩</span>

              {isEditing ? (
                <div style={{ flex: 1, display: "flex", gap: 6, alignItems: "center" }}
                  onClick={(e) => e.stopPropagation()}>
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && renameTemplate(tpl.id)}
                    style={{ ...S.fi, flex: 1 }}
                  />
                  <button onClick={() => renameTemplate(tpl.id)}
                    style={{ ...S.sBtn, background: "#3E2F1C", padding: "5px 12px" }}>OK</button>
                  <button onClick={() => setEditing(null)}
                    style={{ ...S.cBtn, padding: "5px 12px" }}>✕</button>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <div style={ST.cardName}>{tpl.name}</div>
                  <div style={ST.cardMeta}>
                    {tpl.activities.length} {tpl.activities.length === 1 ? "atividade" : "atividades"}
                    {totM > 0 && ` · ${totM}min`}
                  </div>
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
              )}

              <span style={{ ...S.expandIcon, transform: isExp ? "rotate(180deg)" : "rotate(0)" }}>
                <Down />
              </span>

              {!isEditing && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditing(tpl.id); setEditName(tpl.name); }}
                    style={{ ...S.iBtn, color: pal.color }}
                    title="Renomear"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteTemplate(tpl.id); }}
                    style={{ ...S.iBtn, color: "#c58070" }}
                    title="Excluir"
                  >
                    <Trash />
                  </button>
                </>
              )}
            </div>

            {/* Activities */}
            {isExp && (
              <div style={S.actSection}>
                {tpl.activities.length === 0 && (
                  <p style={S.emptyAct}>Adicione as atividades deste bloco</p>
                )}
                {tpl.activities.map((act) => {
                  const au = u[act.universe] || DEFAULT_UNIVERSES.outro;
                  return (
                    <div key={act.id} style={S.actRow}>
                      <span style={{ ...S.actTagBadge, background: au.color + "15", color: au.color }}>
                        {au.emoji}
                      </span>
                      <span style={S.actName}>{act.name}</span>
                      <span style={{ ...S.actDur, color: au.color }}>
                        <Clock /> {act.duration}m
                      </span>
                      <button
                        onClick={() => deleteActivity(tpl.id, act.id)}
                        style={{ ...S.iBtn, color: "#bbb" }}
                      >
                        <Trash />
                      </button>
                    </div>
                  );
                })}
                <AddActivityInline
                  onAdd={(a) => addActivity(tpl.id, a)}
                  accent={pal.color}
                  universes={u}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Add template */}
      {showAdd ? (
        <AddTemplateForm onAdd={addTemplate} onCancel={() => setShowAdd(false)} />
      ) : (
        <button onClick={() => setShowAdd(true)} style={{ ...S.addRitBtn, marginLeft: 0, maxWidth: "100%" }}>
          <Plus /> Criar novo bloco
        </button>
      )}
    </div>
  );
}

/* ── Add template mini-form ── */
function AddTemplateForm({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);

  return (
    <div style={{ ...S.addRitCard, marginLeft: 0 }}>
      <div style={S.formTitle}>Novo Bloco</div>
      <label style={S.fl}>Nome</label>
      <input
        ref={ref} value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && name.trim() && onAdd(name.trim())}
        placeholder="Ex: Bloco 2M3, Rotina Matinal..."
        style={S.fi}
      />
      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 12 }}>
        <button onClick={onCancel} style={S.cBtn}>Cancelar</button>
        <button
          onClick={() => name.trim() && onAdd(name.trim())}
          disabled={!name.trim()}
          style={{ ...S.sBtn, background: name.trim() ? "#3E2F1C" : "#ccc" }}
        >
          Criar
        </button>
      </div>
    </div>
  );
}

/* ── Local styles ── */
const ST = {
  hint: {
    fontSize: 12.5, fontFamily: "'DM Sans'", color: "#8B7355",
    marginBottom: 14, lineHeight: 1.5,
  },
  card: {
    borderLeft: "4px solid #999", borderRadius: "0 12px 12px 0",
    marginBottom: 8, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
  },
  cardHead: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "12px 12px", cursor: "pointer",
  },
  cardEmoji: { fontSize: 18, flexShrink: 0 },
  cardName: { fontSize: 14.5, fontWeight: 700, color: "#3E2F1C" },
  cardMeta: {
    fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 500,
    color: "#A09478", marginTop: 1,
  },
};
