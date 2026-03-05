import { Note } from "../shared/Icons";
import S from "../../styles/theme";

export default function NotesPanel({ value, onChange, accentColor }) {
  return (
    <div style={S.notesPanel}>
      <label style={S.notesLabel}>
        <Note /> Notas do rito
      </label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escreva suas observações aqui..."
        style={{ ...S.notesArea, borderColor: accentColor + "40" }}
        rows={3}
      />
    </div>
  );
}
