export default function Loader() {
  return (
    <div style={{ textAlign: "center", padding: 50 }}>
      <div
        style={{
          width: 22, height: 22,
          border: "3px solid #e0dbd2",
          borderTopColor: "#8B7355",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 10px",
        }}
      />
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8B7355" }}>
        Carregando...
      </p>
    </div>
  );
}
