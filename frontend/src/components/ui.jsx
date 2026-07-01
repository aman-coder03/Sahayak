// ─── ScoreBar ───────────────────────────────────────────
export function ScoreBar({ value, max = 100, color = "bg-brand", label, showValue = true }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-tx-muted">{label}</span>
          {showValue && <span className="text-[10px] font-semibold mono">{value}</span>}
        </div>
      )}
      <div className="h-1.5 bg-bg-4 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── RiskMeter ──────────────────────────────────────────
export function RiskMeter({ score }) {
  const color =
    score >= 80 ? "text-danger" : score >= 50 ? "text-warn" : "text-ok";
  const barColor =
    score >= 80 ? "bg-danger" : score >= 50 ? "bg-warn" : "bg-ok";
  const verdict =
    score >= 80 ? "HIGH RISK" : score >= 50 ? "SUSPICIOUS" : "LOW RISK";

  return (
    <div className="card p-4 text-center">
      <div className="card-title text-center">Risk Score</div>
      <div className={`text-5xl font-black mono ${color}`}>{score}%</div>
      <div className={`text-xs font-semibold mt-1 ${color}`}>{verdict}</div>
      <div className="mt-3 h-2 bg-bg-4 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// ─── Spinner ────────────────────────────────────────────
export function Spinner({ size = "md" }) {
  const s = size === "sm" ? "w-4 h-4 border-2" : "w-6 h-6 border-2";
  return (
    <div
      className={`${s} border-brand-glow border-t-transparent rounded-full animate-spin`}
    />
  );
}

// ─── AuditLog ───────────────────────────────────────────
export function AuditLog({ entries }) {
  return (
    <div className="bg-bg border border-border rounded-md p-3 mono text-[10px] text-ok max-h-36 overflow-y-auto leading-relaxed">
      {entries.map((e, i) => (
        <div key={i}>{e}</div>
      ))}
    </div>
  );
}

// ─── SectionHeader ──────────────────────────────────────
export function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {subtitle && <p className="text-[11px] text-tx-muted mt-0.5">{subtitle}</p>}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

// ─── EmptyState ─────────────────────────────────────────
export function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-tx-muted gap-3">
      <div className="text-3xl">{icon}</div>
      <p className="text-xs">{message}</p>
    </div>
  );
}

// ─── ErrorBanner ────────────────────────────────────────
export function ErrorBanner({ message }) {
  return (
    <div className="bg-danger-bg border border-danger-border rounded-md p-3 text-xs text-red-300 flex items-center gap-2">
      <span>⚠</span> {message}
    </div>
  );
}

// ─── KpiCard ────────────────────────────────────────────
export function KpiCard({ label, value, sub, color = "text-tx", icon }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="card-title">{label}</div>
          <div className={`text-2xl font-black mono mt-1 ${color}`}>{value ?? "—"}</div>
          {sub && <div className="text-[10px] text-tx-muted mt-1">{sub}</div>}
        </div>
        {icon && <div className="text-2xl opacity-60">{icon}</div>}
      </div>
    </div>
  );
}

// ─── IndicatorCard ──────────────────────────────────────
export function IndicatorCard({ label, value }) {
  const isDetected = value?.toLowerCase().startsWith("detected");
  const isPartial = value?.toLowerCase().startsWith("partial");
  const color = isDetected
    ? "text-danger"
    : isPartial
    ? "text-warn"
    : "text-ok";
  return (
    <div className="card p-3">
      <div className="card-title">{label}</div>
      <div className={`text-[11px] font-semibold leading-snug ${color}`}>
        {value || "—"}
      </div>
    </div>
  );
}
