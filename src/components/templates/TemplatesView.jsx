import { useState, useRef, useEffect } from "react";
import { Plus, Trash, Clock, Down, Edit, Chevron } from "../shared/Icons";
import AddActivityInline from "../shared/AddActivityInline";
import { DEFAULT_UNIVERSES } from "../../constants";
import { uid } from "../../utils/helpers";
import S from "../../styles/theme";

/* ── Grip icon for drag handle ── */
const Grip = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="9" cy="5" r="1.5" fill="currentColor"/><circle cx="15" cy="5" r="1.5" fill="currentColor"/>
    <circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="9" cy="19" r="1.5" fill="currentColor"/><circle cx="15" cy="19" r="1.5" fill="currentColor"/>
  </svg>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function TemplatesView({ templates, onSave, universes }) {
  const [expanded, setExpanded]       = useState(null);
  const [showAdd, setShowAdd]         = useState(false);
  const [editing, setEditing]         = useState(null);
  const [editName, setEditName]       = useState("");
  const [collapsedGroups, setCollapsed] = useState({});
  const [showGroupMgr, setShowGroupMgr] = useState(false);

  const u = universes || DEFAULT_UNIVERSES;

  /* ── Derive groups from data ── */
  const groups = [...new Set(templates.map((t) => t.group || "sem grupo"))];

  const grouped = {};
  groups.forEach((g) => { grouped[g] = []; });
  templates.forEach((t) => {
    const g = t.group || "sem grupo";
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(t);
  });

  /* ── Toggle group collapse ── */
  const toggleGroup = (g) => {
    setCollapsed((prev) => ({ ...prev, [g]: !prev[g] }));
  };

  /* ── Template CRUD ── */
  const addTemplate = (name, group) => {
    const tpl = { id: uid(), name, group: group || "sem grupo", activities: [] };
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

  const moveTemplateToGroup = (id, newGroup) => {
    onSave(templates.map((t) => (t.id === id ? { ...t, group: newGroup } : t)));
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

  /* ── Drag reorder within group ── */
  const dragRef = useRef({ dragging: null, overIdx: null, group: null });

  const handleDragStart = (tplId, group) => {
    dragRef.current = { dragging: tplId, overIdx: null, group };
  };

  const handleDragOver = (e, idx, group) => {
    e.preventDefault();
    dragRef.current.overIdx = idx;
    dragRef.current.overGroup = group;
  };

  const handleDrop = (group) => {
    const { dragging, overIdx, overGroup } = dragRef.current;
    if (!dragging || overIdx === null) return;

    const targetGroup = overGroup || group;

    // Build new array: remove dragged, insert at position
    const updated = [...templates];
    const draggedIdx = updated.findIndex((t) => t.id === dragging);
    if (draggedIdx === -1) return;

    const [item] = updated.splice(draggedIdx, 1);
    item.group = targetGroup;

    // Find insertion point: get the items of the target group and find overIdx
    const groupItems = updated.filter((t) => (t.group || "sem grupo") === targetGroup);
    if (overIdx >= groupItems.length) {
      // Append at end of group: find last item of group in array
      const lastInGroup = updated.findLastIndex((t) => (t.group || "sem grupo") === targetGroup);
      updated.splice(lastInGroup + 1, 0, item);
    } else {
      const targetItem = groupItems[overIdx];
      const targetIdx = updated.findIndex((t) => t.id === targetItem.id);
      updated.splice(targetIdx, 0, item);
    }

    onSave(updated);
    dragRef.current = { dragging: null, overIdx: null, group: null };
  };

  /* ── Group management ── */
  const renameGroup = (oldName, newName) => {
    if (!newName.trim() || newName.trim() === oldName) return;
    onSave(templates.map((t) => (t.group || "sem grupo") === oldName ? { ...t, group: newName.trim() } : t));
  };

  const deleteGroup = (groupName) => {
    // Move all templates to "sem grupo"
    onSave(templates.map((t) => (t.group || "sem grupo") === groupName ? { ...t, group: "sem grupo" } : t));
  };

  return (
    <div style={{ animation: "fadeUp 0.3s ease" }}>
      <header style={{ ...S.header, marginBottom: 8 }}>
        <p style={S.viewSubtitle}>Blocos Reutilizáveis</p>
        <h2 style={S.viewTitle}>Defina os ritos que compõem sua rotina</h2>
      </header>

      <p style={ST.hint}>
        Cada bloco é um template de rito. Edite aqui e todas as futuras instâncias
        na semana serão atualizadas. Arraste para reordenar.
      </p>

      {/* Group manager toggle */}
      <button onClick={() => setShowGroupMgr(!showGroupMgr)} style={S.gearBtn}>
        <Edit /> Gerenciar grupos
      </button>

      {showGroupMgr && (
        <GroupManager
          groups={groups}
          onRename={renameGroup}
          onDelete={deleteGroup}
        />
      )}

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

      {/* Grouped list */}
      {groups.map((groupName) => {
        const items = grouped[groupName] || [];
        if (items.length === 0) return null;
        const isCollapsed = collapsedGroups[groupName];
        const groupTotalMin = items.reduce((s, t) => s + t.activities.reduce((ss, a) => ss + a.duration, 0), 0);

        return (
          <div key={groupName} style={ST.groupSection}>
            {/* Group header */}
            <div
              style={ST.groupHeader}
              onClick={() => toggleGroup(groupName)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(groupName)}
            >
              <span style={{ ...ST.groupChevron, transform: isCollapsed ? "rotate(-90deg)" : "rotate(0)" }}>
                <Down />
              </span>
              <span style={ST.groupName}>{groupName}</span>
              <span style={ST.groupCount}>
                {items.length} {items.length === 1 ? "bloco" : "blocos"}
                {groupTotalMin > 0 && ` · ${groupTotalMin}min`}
              </span>
            </div>

            {/* Group items */}
            {!isCollapsed && items.map((tpl, idx) => {
              const isExp = expanded === tpl.id;
              const univs = [...new Set(tpl.activities.map((a) => a.universe))];
              const primary = univs[0] || "outro";
              const pal = u[primary] || DEFAULT_UNIVERSES.outro;
              const totM = tpl.activities.reduce((s, a) => s + a.duration, 0);
              const isEditing = editing === tpl.id;

              return (
                <div
                  key={tpl.id}
                  draggable
                  onDragStart={() => handleDragStart(tpl.id, groupName)}
                  onDragOver={(e) => handleDragOver(e, idx, groupName)}
                  onDrop={() => handleDrop(groupName)}
                  style={{
                    ...ST.card,
                    borderLeftColor: pal.color,
                    background: `linear-gradient(140deg, ${(pal.bg || pal.color + "22")}99 0%, #ffffff99 100%)`,
                  }}
                >
                  {/* Card header */}
                  <div style={ST.cardHead} onClick={() => setExpanded(isExp ? null : tpl.id)}>
                    {/* Drag handle */}
                    <span
                      style={ST.dragHandle}
                      title="Arrastar para reordenar"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Grip />
                    </span>

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
                        {/* Move to group dropdown */}
                        <MoveToGroupBtn
                          currentGroup={groupName}
                          groups={groups}
                          onMove={(g) => moveTemplateToGroup(tpl.id, g)}
                        />
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
          </div>
        );
      })}

      {/* Add template */}
      {showAdd ? (
        <AddTemplateForm groups={groups} onAdd={addTemplate} onCancel={() => setShowAdd(false)} />
      ) : (
        <button onClick={() => setShowAdd(true)} style={{ ...S.addRitBtn, marginLeft: 0, maxWidth: "100%" }}>
          <Plus /> Criar novo bloco
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MOVE-TO-GROUP BUTTON (mini dropdown)
   ═══════════════════════════════════════════ */
function MoveToGroupBtn({ currentGroup, groups, onMove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const others = groups.filter((g) => g !== currentGroup);
  if (others.length === 0) return null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{ ...S.iBtn, color: "#8B7355", fontSize: 10 }}
        title="Mover para outro grupo"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
        </svg>
      </button>
      {open && (
        <div style={ST.moveDropdown}>
          <div style={ST.moveTitle}>Mover para:</div>
          {others.map((g) => (
            <button key={g} onClick={(e) => { e.stopPropagation(); onMove(g); setOpen(false); }} style={ST.moveItem}>
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   GROUP MANAGER
   ═══════════════════════════════════════════ */
function GroupManager({ groups, onRename, onDelete }) {
  const [editingGroup, setEditingGroup] = useState(null);
  const [editValue, setEditValue]       = useState("");
  const [newGroup, setNewGroup]         = useState("");

  const handleAddGroup = () => {
    // Groups are created implicitly when a template uses them.
    // But we can "pre-create" by renaming "sem grupo" or just inform the user.
    // For now, the AddTemplateForm handles new group creation.
  };

  return (
    <div style={ST.groupMgr}>
      <h4 style={ST.groupMgrTitle}>Grupos de blocos</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 8 }}>
        {groups.map((g) => (
          <div key={g} style={ST.groupMgrItem}>
            {editingGroup === g ? (
              <div style={{ display: "flex", gap: 6, flex: 1, alignItems: "center" }}>
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { onRename(g, editValue); setEditingGroup(null); }
                    if (e.key === "Escape") setEditingGroup(null);
                  }}
                  style={{ ...S.fi, flex: 1, padding: "4px 8px" }}
                />
                <button onClick={() => { onRename(g, editValue); setEditingGroup(null); }}
                  style={{ ...S.sBtn, background: "#3E2F1C", padding: "4px 10px", fontSize: 11 }}>OK</button>
              </div>
            ) : (
              <>
                <span style={ST.groupMgrName}>{g}</span>
                <button onClick={() => { setEditingGroup(g); setEditValue(g); }}
                  style={{ ...S.iBtn, color: "#8B7355" }} title="Renomear"><Edit /></button>
                {g !== "sem grupo" && (
                  <button onClick={() => onDelete(g)}
                    style={{ ...S.iBtn, color: "#c58070" }} title="Excluir grupo"><Trash /></button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, fontFamily: "'DM Sans'", color: "#A09478", margin: 0, lineHeight: 1.4 }}>
        Novos grupos são criados ao adicionar um bloco. Para renomear, clique no lápis.
        Excluir um grupo move seus blocos para "sem grupo".
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ADD TEMPLATE FORM (with group picker)
   ═══════════════════════════════════════════ */
function AddTemplateForm({ groups, onAdd, onCancel }) {
  const [name, setName]         = useState("");
  const [group, setGroup]       = useState(groups[0] || "sem grupo");
  const [newGroup, setNewGroup] = useState("");
  const [useNew, setUseNew]     = useState(false);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);

  const submit = () => {
    if (!name.trim()) return;
    const finalGroup = useNew ? newGroup.trim() || "sem grupo" : group;
    onAdd(name.trim(), finalGroup);
  };

  return (
    <div style={{ ...S.addRitCard, marginLeft: 0 }}>
      <div style={S.formTitle}>Novo Bloco</div>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <label style={S.fl}>Nome</label>
          <input
            ref={ref} value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Ex: Bloco 2M3, Rotina Matinal..."
            style={S.fi}
          />
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={S.fl}>Grupo</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!useNew ? (
            <>
              <select value={group} onChange={(e) => setGroup(e.target.value)} style={{ ...S.fs, flex: 1 }}>
                {groups.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <button onClick={() => setUseNew(true)}
                style={{ ...S.cBtn, padding: "6px 10px", fontSize: 11, whiteSpace: "nowrap" }}>
                + Novo grupo
              </button>
            </>
          ) : (
            <>
              <input
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                placeholder="Nome do novo grupo"
                style={{ ...S.fi, flex: 1 }}
              />
              <button onClick={() => setUseNew(false)}
                style={{ ...S.cBtn, padding: "6px 10px", fontSize: 11 }}>
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={S.cBtn}>Cancelar</button>
        <button
          onClick={submit}
          disabled={!name.trim()}
          style={{ ...S.sBtn, background: name.trim() ? "#3E2F1C" : "#ccc" }}
        >
          Criar
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LOCAL STYLES
   ═══════════════════════════════════════════ */
const ST = {
  hint: {
    fontSize: 12.5, fontFamily: "'DM Sans'", color: "#8B7355",
    marginBottom: 14, lineHeight: 1.5,
  },

  /* Group section */
  groupSection: {
    marginBottom: 16,
  },
  groupHeader: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 12px", cursor: "pointer",
    background: "rgba(255,255,255,0.35)", borderRadius: 10,
    marginBottom: 6, userSelect: "none",
    border: "1.5px solid #E0DAD0",
  },
  groupChevron: {
    color: "#8B7355", display: "flex", transition: "transform 0.2s",
  },
  groupName: {
    fontSize: 13, fontFamily: "'DM Sans'", fontWeight: 700,
    color: "#3E2F1C", textTransform: "capitalize", flex: 1,
  },
  groupCount: {
    fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 500,
    color: "#A09478",
  },

  /* Card */
  card: {
    borderLeft: "4px solid #999", borderRadius: "0 12px 12px 0",
    marginBottom: 6, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
    transition: "box-shadow 0.15s, opacity 0.15s",
  },
  cardHead: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 12px", cursor: "pointer",
  },
  dragHandle: {
    cursor: "grab", color: "#C0B8A6", display: "flex", alignItems: "center",
    padding: "2px 0", flexShrink: 0,
  },
  cardName: { fontSize: 14, fontWeight: 700, color: "#3E2F1C" },
  cardMeta: {
    fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 500,
    color: "#A09478", marginTop: 1,
  },

  /* Move-to-group dropdown */
  moveDropdown: {
    position: "absolute", top: "100%", right: 0, marginTop: 4, zIndex: 20,
    background: "#fff", borderRadius: 10, border: "1px solid #e0dbd2",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)", overflow: "hidden", minWidth: 140,
  },
  moveTitle: {
    padding: "8px 12px 4px", fontSize: 10, fontFamily: "'DM Sans'",
    fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#A09478",
  },
  moveItem: {
    display: "block", width: "100%", padding: "8px 12px", border: "none",
    background: "none", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: 12,
    fontWeight: 500, color: "#3E2F1C", textAlign: "left",
    textTransform: "capitalize", borderTop: "1px solid #f0ebe0",
  },

  /* Group manager */
  groupMgr: {
    background: "rgba(255,255,255,0.5)", border: "1.5px solid #D4CCB8",
    borderRadius: 12, padding: 14, marginBottom: 14, animation: "fadeUp 0.2s ease",
  },
  groupMgrTitle: {
    margin: "0 0 10px", fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: 2, color: "#8B7355",
  },
  groupMgrItem: {
    display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
    background: "rgba(255,255,255,0.5)", borderRadius: 8,
    border: "1px solid #E8E2D6",
  },
  groupMgrName: {
    flex: 1, fontSize: 12.5, fontFamily: "'DM Sans'", fontWeight: 600,
    color: "#3E2F1C", textTransform: "capitalize",
  },
};