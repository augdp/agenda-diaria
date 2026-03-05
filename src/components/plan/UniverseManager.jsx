import { useState } from "react";
import { Plus, Trash } from "../shared/Icons";
import { PRESET_COLORS } from "../../constants";
import S from "../../styles/theme";

export default function UniverseManager({ universes, onSave }) {
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("⭐");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const addUniverse = () => {
    if (!label.trim()) return;
    const key = label.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (!key || universes[key]) return;

    onSave({
      ...universes,
      [key]: { label: label.trim(), emoji, color, bg: color + "22" },
    });
    setLabel("");
    setEmoji("⭐");
  };

  const removeUniverse = (key) => {
    const next = { ...universes };
    delete next[key];
    onSave(next);
  };

  return (
    <div style={S.uniMgr}>
      <h4 style={S.uniTitle}>Universos disponíveis</h4>

      {/* List */}
      <div style={S.uniList}>
        {Object.entries(universes).map(([k, v]) => (
          <div key={k} style={{ ...S.uniItem, borderLeftColor: v.color }}>
            <span style={{ fontSize: 16 }}>{v.emoji}</span>
            <span style={{ flex: 1, fontSize: 12.5, fontFamily: "'DM Sans'", fontWeight: 600, color: "#3E2F1C" }}>
              {v.label}
            </span>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: v.color }} />
            <button onClick={() => removeUniverse(k)} style={{ ...S.iBtn, color: "#c58070" }}>
              <Trash />
            </button>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div style={S.uniAddRow}>
        <input
          value={emoji} onChange={(e) => setEmoji(e.target.value)}
          style={{ ...S.fi, width: 44, textAlign: "center", padding: "6px 4px" }}
          maxLength={2}
        />
        <input
          value={label} onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addUniverse()}
          placeholder="Nome do universo"
          style={{ ...S.fi, flex: 1 }}
        />
        <div style={{ display: "flex", gap: 3 }}>
          {PRESET_COLORS.map((c) => (
            <button
              key={c} onClick={() => setColor(c)}
              style={{
                width: 18, height: 18, borderRadius: 4, background: c, cursor: "pointer",
                border: color === c ? "2px solid #3E2F1C" : "2px solid transparent",
              }}
            />
          ))}
        </div>
        <button
          onClick={addUniverse} disabled={!label.trim()}
          style={{ ...S.sBtn, background: label.trim() ? "#3E2F1C" : "#ccc", padding: "6px 14px" }}
        >
          <Plus />
        </button>
      </div>
    </div>
  );
}
