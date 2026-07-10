import { useEffect, useState } from "react";
import { getDashboardSummary, getCrimeHotspots } from "../services/api";
import { KpiCard, Spinner, ErrorBanner } from "../components/ui";
import { useTheme } from "../hooks/useTheme";
import { getChartColors } from "../lib/chartTheme";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  MdSecurity, MdWarning, MdGavel, MdHub,
  MdFiberManualRecord,
} from "react-icons/md";

const MOCK_CHART = [
  { time: "00:00", cases: 12, high: 4 },
  { time: "03:00", cases: 8, high: 2 },
  { time: "06:00", cases: 22, high: 9 },
  { time: "09:00", cases: 47, high: 18 },
  { time: "12:00", cases: 63, high: 27 },
  { time: "15:00", cases: 55, high: 22 },
  { time: "18:00", cases: 78, high: 34 },
  { time: "21:00", cases: 91, high: 41 },
  { time: "Now", cases: 83, high: 38 },
];

const FEED = [
  { color: "text-danger", dot: "bg-danger", title: "Digital arrest cluster — Delhi NCR", sub: "14 calls · SIM block sent to DoT", time: "2m ago" },
  { color: "text-danger", dot: "bg-danger", title: "New mule account linked to Cluster A", sub: "₹40k inflow · FIU auto-notified", time: "8m ago" },
  { color: "text-warn", dot: "bg-warn", title: "Counterfeit ₹500 — Kolkata PS", sub: "Serial prefix MBK · FICN batch match", time: "14m ago" },
  { color: "text-warn", dot: "bg-warn", title: "UPI structuring detected — Hyderabad", sub: "₹2L round-trip · PMLA flag", time: "31m ago" },
  { color: "text-brand", dot: "bg-brand", title: "Citizen report averted — Pune", sub: "No transfer · FIR filed · number traced", time: "45m ago" },
  { color: "text-ok", dot: "bg-ok", title: "Arrest: 2 suspects — Nuh, HR", sub: "₹80k + 12 SIMs seized · forensics ongoing", time: "1h ago" },
];

const RECENT = [
  { id: "CASE-2847", type: "Digital Arrest", risk: "HIGH", city: "Delhi", score: 94, status: "Active" },
  { id: "CASE-2846", type: "Customs Scam", risk: "HIGH", city: "Mumbai", score: 88, status: "Active" },
  { id: "CASE-2845", type: "UPI Fraud", risk: "MEDIUM", city: "Bengaluru", score: 61, status: "Investigating" },
  { id: "CASE-2844", type: "Job Scam", risk: "MEDIUM", city: "Hyderabad", score: 55, status: "Investigating" },
  { id: "CASE-2843", type: "Digital Arrest", risk: "HIGH", city: "Patna", score: 91, status: "Closed" },
];

function RiskBadge({ risk }) {
  if (risk === "HIGH") return <span className="badge-red">HIGH</span>;
  if (risk === "MEDIUM") return <span className="badge-amber">MEDIUM</span>;
  return <span className="badge-green">LOW</span>;
}

function StatusBadge({ status }) {
  if (status === "Active") return <span className="badge-red">{status}</span>;
  if (status === "Investigating") return <span className="badge-amber">{status}</span>;
  return <span className="badge-gray">{status}</span>;
}

export default function Dashboard() {
  const { theme } = useTheme();
  const c = getChartColors(theme);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardSummary()
      .then((r) => setSummary(r.data))
      .catch(() => setError("Backend unreachable — showing demo data"))
      .finally(() => setLoading(false));
  }, []);

  const total = summary?.total_cases ?? 247;
  const high = summary?.high_risk_cases ?? 89;
  const threat = summary?.threat_level ?? "SEVERE";

  return (
    <div className="p-5 space-y-5 animate-fadeIn">
      {/* Hero */}
      <div className="bg-bg-2 border border-border rounded-lg p-5 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-tx-dim uppercase tracking-widest mb-1">
            National Cybercrime Intelligence Platform
          </div>
          <h1 className="text-xl font-bold">Command Dashboard</h1>
          <p className="text-xs text-tx-muted mt-1">
            Real-time threat intelligence · NCRB integrated · MHA / CERT-In certified
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-tx-dim uppercase tracking-widest">Threat Level</div>
          <div className="text-2xl font-black text-danger">{threat}</div>
          <div className="flex items-center justify-end gap-1.5 mt-1">
            <MdFiberManualRecord className="text-ok text-xs animate-pulse2" />
            <span className="text-[11px] text-ok font-medium">All systems operational</span>
          </div>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* KPI Grid */}
      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          <KpiCard label="Total Cases" value={total.toLocaleString()} sub="All time" color="text-brand" icon="📁" />
          <KpiCard label="High Risk Cases" value={high} sub="Active investigations" color="text-danger" icon="🚨" />
          <KpiCard label="Threat Level" value={threat} sub="National status" color="text-danger" icon="⚠️" />
          <KpiCard label="Active Clusters" value="14" sub="Fraud rings tracked" color="text-warn" icon="🕸" />
        </div>
      )}

      {/* Chart + Feed */}
      <div className="grid grid-cols-3 gap-4">
        {/* Chart */}
        <div className="col-span-2 card p-4">
          <div className="card-title">Fraud Activity — 24h</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_CHART} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gCases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c.neutral} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={c.neutral} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c.danger} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={c.danger} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={c.grid} strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fill: c.axis, fontSize: 10 }} />
              <YAxis tick={{ fill: c.axis, fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 6, fontSize: 11 }}
                labelStyle={{ color: c.tooltipText }}
              />
              <Area type="monotone" dataKey="cases" stroke={c.neutral} fill="url(#gCases)" strokeWidth={2} name="Total" />
              <Area type="monotone" dataKey="high" stroke={c.danger} fill="url(#gHigh)" strokeWidth={2} name="High Risk" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Feed */}
        <div className="card p-4 overflow-hidden flex flex-col">
          <div className="card-title">Threat Activity Feed</div>
          <div className="flex-1 overflow-y-auto space-y-0 divide-y divide-border">
            {FEED.map((f, i) => (
              <div key={i} className="py-2.5 flex gap-2.5 items-start">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${f.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium leading-snug truncate">{f.title}</div>
                  <div className="text-[10px] text-tx-muted mt-0.5 truncate">{f.sub}</div>
                </div>
                <div className="text-[9px] text-tx-dim flex-shrink-0">{f.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Investigations */}
      <div className="card p-4">
        <div className="card-title">Recent Investigations</div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-tx-dim text-[10px] uppercase tracking-wider border-b border-border">
              <th className="text-left pb-2 font-medium">Case ID</th>
              <th className="text-left pb-2 font-medium">Type</th>
              <th className="text-left pb-2 font-medium">Risk</th>
              <th className="text-left pb-2 font-medium">City</th>
              <th className="text-left pb-2 font-medium">Score</th>
              <th className="text-left pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {RECENT.map((r) => (
              <tr key={r.id} className="hover:bg-bg-3 transition-colors">
                <td className="py-2.5 mono text-brand">{r.id}</td>
                <td className="py-2.5">{r.type}</td>
                <td className="py-2.5"><RiskBadge risk={r.risk} /></td>
                <td className="py-2.5 text-tx-muted">{r.city}</td>
                <td className="py-2.5 mono">{r.score}%</td>
                <td className="py-2.5"><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
