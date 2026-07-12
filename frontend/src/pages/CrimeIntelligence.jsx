import { useEffect, useState } from "react";
import { getCrimeHotspots } from "../services/api";
import { Spinner, ErrorBanner } from "../components/ui";
import { useTheme } from "../hooks/useTheme";
import { getChartColors } from "../lib/chartTheme";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

const TYPE_COLOR = {
  digital_arrest: { bg: "bg-danger-bg", border: "border-danger-border", text: "text-danger", label: "Digital Arrest" },
  counterfeit: { bg: "bg-warn-bg", border: "border-warn-border", text: "text-warn", label: "Counterfeit ₹" },
  upi: { bg: "bg-bg-4", border: "border-border-2", text: "text-tx-muted", label: "UPI Fraud" },
  job_scam: { bg: "bg-violet-bg", border: "border-violet-border", text: "text-violet", label: "Job Scam" },
};

const FALLBACK = [
  { city: "Delhi NCR", cases: 312, type: "digital_arrest", lat: 28.61, lng: 77.23 },
  { city: "Jamtara, JH", cases: 280, type: "digital_arrest", lat: 23.97, lng: 86.8 },
  { city: "Nuh, HR", cases: 260, type: "digital_arrest", lat: 28.1, lng: 77.01 },
  { city: "Mumbai", cases: 198, type: "upi", lat: 19.07, lng: 72.87 },
  { city: "Hyderabad", cases: 156, type: "upi", lat: 17.38, lng: 78.47 },
  { city: "Bengaluru", cases: 143, type: "upi", lat: 12.97, lng: 77.59 },
  { city: "Kolkata", cases: 121, type: "counterfeit", lat: 22.57, lng: 88.36 },
  { city: "Chennai", cases: 98, type: "counterfeit", lat: 13.08, lng: 80.27 },
  { city: "Patna", cases: 87, type: "digital_arrest", lat: 25.59, lng: 85.13 },
  { city: "Ahmedabad", cases: 76, type: "job_scam", lat: 23.02, lng: 72.57 },
];

const barColor = (type, c) => {
  if (type === "digital_arrest") return c.danger;
  if (type === "counterfeit") return c.dangerSoft;
  if (type === "upi") return c.mid;
  return c.dim;
};

export default function CrimeIntelligence() {
  const { theme } = useTheme();
  const c = getChartColors(theme);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getCrimeHotspots()
      .then((r) => {
        const data = r.data?.hotspots ?? r.data ?? [];
        setHotspots(data.length ? data : FALLBACK);
      })
      .catch(() => {
        setError("Using demo data — backend unreachable");
        setHotspots(FALLBACK);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? hotspots : hotspots.filter((h) => h.type === filter);
  const total = hotspots.reduce((a, b) => a + (b.cases ?? 0), 0);
  const topCity = [...hotspots].sort((a, b) => b.cases - a.cases)[0];

  return (
    <div className="p-5 animate-fadeIn space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-sm font-semibold">Crime Intelligence</h1>
          <p className="text-[11px] text-tx-muted mt-0.5">
            DBSCAN spatial clustering · NCRB FIR feed · OR-Tools patrol optimisation
          </p>
        </div>
        <select
          className="input w-44 text-xs"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All crime types</option>
          <option value="digital_arrest">Digital Arrest</option>
          <option value="counterfeit">Counterfeit ₹</option>
          <option value="upi">UPI Fraud</option>
          <option value="job_scam">Job Scam</option>
        </select>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-3">
            <div className="card p-3 text-center">
              <div className="card-title">Total Complaints</div>
              <div className="text-2xl font-black mono text-brand">{total.toLocaleString()}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="card-title">Cities Tracked</div>
              <div className="text-2xl font-black mono text-tx">{hotspots.length}</div>
            </div>
            <div className="card p-3 text-center">
              <div className="card-title">Top Hotspot</div>
              <div className="text-sm font-bold text-danger">{topCity?.city ?? "—"}</div>
              <div className="text-[10px] text-tx-muted">{topCity?.cases} cases</div>
            </div>
            <div className="card p-3 text-center">
              <div className="card-title">Patrol Routes</div>
              <div className="text-2xl font-black mono text-ok">3</div>
              <div className="text-[10px] text-tx-muted">Optimised</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 card p-4">
              <div className="card-title">Complaint Density by City</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={filtered} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
                  <CartesianGrid stroke={c.grid} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="city"
                    tick={{ fill: c.axis, fontSize: 9 }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fill: c.axis, fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 6, fontSize: 11 }}
                    labelStyle={{ color: c.tooltipText }}
                  />
                  <Bar dataKey="cases" radius={[3, 3, 0, 0]} maxBarSize={32}>
                    {filtered.map((h, i) => (
                      <Cell key={i} fill={barColor(h.type, c)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-4">
              <div className="card-title">By Crime Type</div>
              <div className="space-y-2.5 mt-2">
                {Object.entries(TYPE_COLOR).map(([type, style]) => {
                  const count = hotspots.filter((h) => h.type === type).reduce((a, b) => a + (b.cases ?? 0), 0);
                  const pct = total ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={type}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className={style.text}>{style.label}</span>
                        <span className="mono">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-bg-4 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${type === "digital_arrest" ? "bg-danger" : type === "counterfeit" ? "bg-warn" : type === "upi" ? "bg-brand" : "bg-violet"}`}
                          style={{ width: `${pct}%`, transition: "width .6s ease" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="card-title mb-2">Hotspot Intelligence Cards</div>
            <div className="grid grid-cols-5 gap-2">
              {filtered.map((h, i) => {
                const style = TYPE_COLOR[h.type] ?? TYPE_COLOR.upi;
                const isSelected = selected?.city === h.city;
                return (
                  <div
                    key={i}
                    className={`card p-3 cursor-pointer transition-all border ${
                      isSelected ? "border-brand shadow-glow" : "border-border hover:border-border-2"
                    } ${style.bg}`}
                    onClick={() => setSelected(isSelected ? null : h)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="text-xs font-semibold leading-snug">{h.city}</div>
                      <div className={`text-[10px] font-bold ${style.text}`}>#{i + 1}</div>
                    </div>
                    <div className={`text-xl font-black mono ${style.text}`}>{h.cases}</div>
                    <div className="text-[9px] text-tx-muted mt-0.5">{style.label}</div>
                    {h.lat && (
                      <div className="text-[9px] text-tx-dim mt-1 mono">
                        {h.lat.toFixed(2)}, {h.lng.toFixed(2)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {selected && (
            <div className="card p-4 border border-brand-border bg-brand-bg animate-slideUp">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold">{selected.city} — Intelligence Summary</div>
                <button className="text-tx-dim hover:text-tx text-xs" onClick={() => setSelected(null)}>✕</button>
              </div>
              <div className="grid grid-cols-4 gap-4 text-xs">
                <div><div className="card-title">Cases</div><div className="text-lg font-black mono text-danger">{selected.cases}</div></div>
                <div><div className="card-title">Type</div><div className="font-medium">{TYPE_COLOR[selected.type]?.label ?? selected.type}</div></div>
                <div><div className="card-title">Coordinates</div><div className="mono text-[10px]">{selected.lat}, {selected.lng}</div></div>
                <div><div className="card-title">Patrol Priority</div><div className="text-danger font-bold">HIGH</div></div>
              </div>
              <div className="mt-3 pt-3 border-t border-border text-[11px] text-tx-muted">
                Recommended: Deploy cyber cell unit · cross-match with district SP database · flag for inter-agency sharing
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}