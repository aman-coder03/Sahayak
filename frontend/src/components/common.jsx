import React from "react";

export function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {children}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  badge,
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold">
          {title}
        </h2>

        {badge && (
          <span className="px-2 py-1 text-xs rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-slate-400 text-sm mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Spinner({
  size = "md",
}) {
  const cls =
    size === "lg"
      ? "w-10 h-10"
      : "w-6 h-6";

  return (
    <div
      className={`${cls} border-2 border-slate-700 border-t-cyan-400 rounded-full animate-spin`}
    />
  );
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  sublabel,
}) {
  return (
    <Card className="p-5">
      <div className="flex justify-between items-center">

        <div>

          <div className="text-slate-400 text-sm">
            {label}
          </div>

          <div className="text-3xl font-bold mt-1">
            {value}
          </div>

          {sublabel && (
            <div className="text-xs text-slate-500 mt-2">
              {sublabel}
            </div>
          )}

        </div>

        {Icon && (
          <Icon className="text-3xl text-cyan-400" />
        )}

      </div>
    </Card>
  );
}

export function RiskBadge({
  level,
}) {

  const styles = {
    HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
    CRITICAL:
      "bg-red-500/10 text-red-400 border-red-500/20",
    MEDIUM:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    LOW:
      "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded border ${
        styles[level] ||
        "bg-slate-500/10 text-slate-300 border-slate-500/20"
      }`}
    >
      {level}
    </span>
  );
}

export function CmdButton({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      className={`px-4 py-2 bg-cyan-500 text-black rounded font-semibold flex items-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
}

export function CmdTextarea({
  label,
  ...props
}) {
  return (
    <div>

      {label && (
        <label className="block mb-2 text-sm text-slate-400">
          {label}
        </label>
      )}

      <textarea
        {...props}
        className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white"
      />
    </div>
  );
}

export function ScoreBar({
  value = 0,
}) {
  return (
    <div className="w-full h-2 bg-slate-800 rounded overflow-hidden">
      <div
        className="h-full bg-cyan-400"
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}

export function Alert({
  children,
}) {
  return (
    <div className="p-4 rounded bg-slate-900 border border-slate-700">
      {children}
    </div>
  );
}