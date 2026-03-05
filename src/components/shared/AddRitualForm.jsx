import { useState, useEffect, useRef } from "react";
import S from "../../styles/theme";

export default function AddRitualForm({ onAdd, onCancel, offset = 0 }) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("08:00");
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const submit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), startTime: time });
  };

  return (
    <div style={{ ...S.addRitCard, marginLeft: offset }}>
      <div style={S.formTitle}>Novo Rito</div>

      <div style={{ display: "flex", gap: 10 }}>
        <div>
          <label style={S.fl}>Horário</label>
          <input
            type="time" value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ ...S.fi, width: 115 }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={S.fl}>Nome</label>
          <input
            ref={ref} value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Ex: Rotina matinal"
            style={S.fi}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 12 }}>
        <button onClick={onCancel} style={S.cBtn}>Cancelar</button>
        <button
          onClick={submit} disabled={!name.trim()}
          style={{ ...S.sBtn, background: name.trim() ? "#3E2F1C" : "#ccc" }}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
