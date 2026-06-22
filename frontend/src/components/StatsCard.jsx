function StatsCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "12px",
        borderLeft: `6px solid ${color}`,
        color: "white",
        minWidth: "220px",
      }}
    >
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

export default StatsCard;