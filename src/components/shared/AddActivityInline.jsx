import { useState, useRef } from "react";
import { Plus } from "./Icons";
import { DURATION_OPTIONS } from "../../constants";
import S from "../../styles/theme";

export default function AddActivityInline({ onAdd, accent, universes }) {
  const [open, setOpen]   = useState(false);
  const [name, setName]   = useState("");
  const [dur, setDur]     = useState(30);
  const [uni, setUni]     = useState(Object.keys(universes)[0] || "outro");
  const ref = useRef(null);

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setTimeout(() => ref.current?.focus(), 50); }}
        style={{ ...S.addActBtn, color: accent }}
      >
        <Plus /> Adicionar atividade
      </button>
    );
  }

  const submit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), duration: dur, universe: uni });
    setName("");
    setOpen(false);
  };

  return (
    <div style={S.addActForm}>
      <input
        ref={ref} value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Nome da atividade"
        style={S.fi}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <select value={dur} onChange={(e) => setDur(Number(e.target.value))} style={{ ...S.fs, width: 90 }}>
          {DURATION_OPTIONS.map((d) => <option key={d} value={d}>{d} min</option>)}
        </select>
        <select value={uni} onChange={(e) => setUni(e.target.value)} style={{ ...S.fs, flex: 1 }}>
          {Object.entries(universes).map(([k, v]) => (
            <option key={k} value={k}>{v.emoji} {v.label}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
        <button onClick={() => setOpen(false)} style={S.cBtn}>Cancelar</button>
        <button
          onClick={submit} disabled={!name.trim()}
          style={{ ...S.sBtn, background: name.trim() ? accent : "#ccc" }}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
