import { MdErrorOutline, MdTerminal } from "react-icons/md";

/* ---------------------------------- Spinner ---------------------------------- */
export function Spinner({ size = "md" }) {
  const px = size === "sm" ? 14 : 22;
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      className="animate-spin text-brand"
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -------------------------------- ErrorBanner -------------------------------- */
export function ErrorBanner({ message }) {
  return (
    <div className="card glow-border-warn border-warn-border bg-warn-bg p-3 flex items-start gap-2.5">
      <MdErrorOutline className="text-warn text-base flex-shrink-0 mt-0.5" />
      <p className="text-xs text-tx leading-relaxed">{message}</p>
    </div>
  );
}

/* ---------------------------------- KpiCard ---------------------------------- */
export function KpiCard({ label, value, sub, color = "text-brand", icon }) {
  return (
    <div className="card p-4 hover:border-border-2 transition-colors">
      <div className="flex items-start justify-between">
        <div className="card-title mb-1">{label}</div>
        {icon && <span className="text-base leading-none opacity-80">{icon}</span>}
      </div>
      <div className={`text-2xl font-black mono ${color}`}>{value}</div>
      {sub && <div className="mt-1 text-[10px] text-tx-muted">{sub}</div>}
    </div>
  );
}

/* ---------------------------------- RiskMeter --------------------------------- */
export function RiskMeter({ score = 0 }) {
  const clamped = Math.max(0, Math.min(100, score));
  const tone =
    clamped >= 80 ? { stroke: "var(--raw-danger)", text: "text-danger", label: "CRITICAL" } :
    clamped >= 50 ? { stroke: "var(--raw-warn)", text: "text-warn", label: "ELEVATED" } :
    { stroke: "var(--raw-ok)", text: "text-ok", label: "LOW" };

  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div className="card p-5 flex items-center gap-5">
      <div className="relative flex-shrink-0" style={{ width: 128, height: 128 }}>
        <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
          <circle cx="64" cy="64" r={r} fill="none" stroke="var(--raw-border)" strokeWidth="10" />
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke={tone.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(.16,1,.3,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-black mono ${tone.text}`}>{clamped}</span>
          <span className="text-[9px] text-tx-dim uppercase tracking-widest">/ 100</span>
        </div>
      </div>
      <div>
        <div className="card-title">Fraud Risk Score</div>
        <div className={`text-lg font-bold ${tone.text}`}>{tone.label}</div>
        <p className="mt-1 text-[11px] text-tx-muted leading-relaxed">
          Composite score from authority, urgency and payment-pressure signals detected in the message.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------- ScoreBar ---------------------------------- */
export function ScoreBar({ label, value = 0, color = "bg-brand" }) {
  const clamped = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-tx-muted">{label}</span>
        <span className="text-[11px] mono font-semibold text-tx">{clamped}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-bg-4 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${clamped}%`, transition: "width 0.6s cubic-bezier(.16,1,.3,1)" }}
        />
      </div>
    </div>
  );
}

/* ---------------------------------- AuditLog ---------------------------------- */
export function AuditLog({ entries = [] }) {
  return (
    <div className="rounded-md border border-border bg-bg-1 p-3 max-h-40 overflow-y-auto">
      <div className="flex items-center gap-1.5 mb-2 text-[9px] uppercase tracking-widest text-tx-dim">
        <MdTerminal className="text-brand text-xs" />
        Immutable log
      </div>
      <div className="space-y-1">
        {entries.map((e, i) => (
          <div key={i} className="mono text-[10px] text-tx-muted leading-relaxed break-all">
            <span className="text-brand">›</span> {e}
          </div>
        ))}
      </div>
    </div>
  );
}
