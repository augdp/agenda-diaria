import { useState } from "react";
import { Copy } from "../shared/Icons";
import { WEEKDAYS_FULL } from "../../constants/dates";
import S from "../../styles/theme";

export default function CopyDayDropdown({ currentDay, onCopy }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", marginTop: 8 }}>
      <button onClick={() => setOpen(!open)} style={S.copyBtn}>
        <Copy /> Copiar ritos para outro dia
      </button>

      {open && (
        <div style={S.copyDropdown}>
          {WEEKDAYS_FULL.map((name, i) =>
            i !== currentDay ? (
              <button
                key={i}
                onClick={() => { onCopy(i); setOpen(false); }}
                style={S.copyItem}
              >
                {name}
              </button>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
