import { useEffect, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts'
import {
  MdWarningAmber, MdBugReport, MdOutlineSpeed, MdHub,
  MdArrowUpward, MdArrowDownward, MdCircle
} from 'react-icons/md'
import { getDashboardSummary } from '../services/api'
import { KpiCard, SectionHeader, Card, RiskBadge, PageWrapper, Spinner } from '../components/common'

const MOCK_CHART = [
  { time: '00:00', scams: 12, fraud: 8, arrests: 3 },
  { time: '04:00', scams: 5, fraud: 4, arrests: 1 },
  { time: '08:00', scams: 18, fraud: 14, arrests: 7 },
  { time: '12:00', scams: 34, fraud: 22, arrests: 11 },
  { time: '16:00', scams: 28, fraud: 19, arrests: 9 },
  { time: '20:00', scams: 41, fraud: 30, arrests: 14 },
  { time: '23:59', scams: 22, fraud: 17, arrests: 6 },
]

const MOCK_FEED = [
  { id: 'C-2841', type: 'Digital Arrest', risk: 'CRITICAL', city: 'Mumbai', time: '2m ago' },
  { id: 'C-2840', type: 'UPI Fraud', risk: 'HIGH', city: 'Delhi', time: '7m ago' },
  { id: 'C-2839', type: 'KYC Scam', risk: 'HIGH', city: 'Bangalore', time: '12m ago' },
  { id: 'C-2838', type: 'FedEx Scam', risk: 'MEDIUM', city: 'Hyderabad', time: '19m ago' },
  { id: 'C-2837', type: 'Vishing', risk: 'MEDIUM', city: 'Chennai', time: '31m ago' },
  { id: 'C-2836', type: 'SIM Swap', risk: 'HIGH', city: 'Pune', time: '45m ago' },
]

const MOCK_INVESTIGATIONS = [
  { case_id: 2841, type: 'Digital Arrest Scam', suspect_phone: '+91-98765-XXXXX', cluster: 'C-7', confidence: 94, status: 'ACTIVE' },
  { case_id: 2840, type: 'UPI Chain Fraud', suspect_phone: '+91-91234-XXXXX', cluster: 'C-3', confidence: 87, status: 'ACTIVE' },
  { case_id: 2839, type: 'KYC Impersonation', suspect_phone: '+91-76543-XXXXX', cluster: 'C-7', confidence: 81, status: 'REVIEWING' },
  { case_id: 2835, type: 'FedEx Courier Scam', suspect_phone: '+91-88990-XXXXX', cluster: 'C-1', confidence: 76, status: 'CLOSED' },
]

const TOOLTIP_STYLE = {
  backgroundColor: '#111827',
  border: '1px solid #1e2535',
  borderRadius: '6px',
  color: '#e2e8f0',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '12px',
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardSummary()
      .then((r) => setSummary(r.data))
      .catch(() => setSummary({ total_cases: 2841, high_risk_cases: 184, threat_level: 'ELEVATED' }))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper>
      {/* Hero */}
      <div className="relative rounded-xl border border-cmd-border bg-gradient-to-r from-cmd-surface via-cmd-card to-cmd-surface overflow-hidden px-8 py-7">
        <div className="absolute inset-0 cmd-grid opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-cmd-accent/5 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-cmd-accent tracking-[0.2em] uppercase">
              ▸ SAHAYAK v1.0 — ACTIVE MONITORING
            </span>
          </div>
          <h1 className="text-3xl font-bold text-cmd-text mb-1">
            Cyber Crime <span className="text-cmd-accent">Command Center</span>
          </h1>
          <p className="text-cmd-subtext text-sm">
            Digital Public Safety Intelligence Platform — Real-time fraud detection, investigation support &amp; evidence generation
          </p>
          <div className="flex gap-4 mt-4">
            {['AI-Powered Detection', 'Fraud DNA Engine', 'Network Intelligence', 'Evidence Generation'].map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-3 py-1 bg-cmd-accent/5 border border-cmd-accent/15 rounded-full text-cmd-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="flex justify-center py-8"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <KpiCard
            label="Total Cases"
            value={summary?.total_cases?.toLocaleString()}
            icon={MdBugReport}
            color="accent"
            sublabel="All time registered"
          />
          <KpiCard
            label="High Risk Cases"
            value={summary?.high_risk_cases}
            icon={MdWarningAmber}
            color="danger"
            sublabel="Requiring immediate action"
          />
          <KpiCard
            label="Threat Level"
            value={summary?.threat_level}
            icon={MdOutlineSpeed}
            color="warn"
            sublabel="National cyber threat index"
          />
          <KpiCard
            label="Active Clusters"
            value="14"
            icon={MdHub}
            color="purple"
            sublabel="Fraud network clusters"
          />
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Area chart */}
        <Card className="col-span-2 p-5">
          <SectionHeader title="Threat Activity — 24H" badge="LIVE" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_CHART} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scamGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" />
              <XAxis dataKey="time" tick={{ fill: '#4b5563', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis tick={{ fill: '#4b5563', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              <Area type="monotone" dataKey="scams" stroke="#00d4ff" fill="url(#scamGrad)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="fraud" stroke="#ef4444" fill="url(#fraudGrad)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="arrests" stroke="#10b981" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Fraud type bar */}
        <Card className="p-5">
          <SectionHeader title="Fraud Types" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              layout="vertical"
              data={[
                { type: 'Digital Arrest', count: 41 },
                { type: 'UPI Fraud', count: 34 },
                { type: 'KYC Scam', count: 28 },
                { type: 'Vishing', count: 19 },
                { type: 'SIM Swap', count: 12 },
              ]}
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis type="number" tick={{ fill: '#4b5563', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
              <YAxis type="category" dataKey="type" tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'JetBrains Mono' }} width={80} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="#00d4ff" fillOpacity={0.7} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Threat feed */}
        <Card className="p-5">
          <SectionHeader title="Live Threat Feed" badge="REAL-TIME" />
          <div className="space-y-2">
            {MOCK_FEED.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded bg-cmd-bg border border-cmd-border hover:border-cmd-accent/20 transition-colors group"
              >
                <MdCircle
                  className={`text-xs flex-shrink-0 ${
                    item.risk === 'CRITICAL'
                      ? 'text-red-400 animate-pulse'
                      : item.risk === 'HIGH'
                      ? 'text-cmd-danger'
                      : 'text-cmd-warn'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-cmd-text truncate">{item.type}</div>
                  <div className="text-xs text-cmd-muted">{item.city} · {item.time}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <RiskBadge level={item.risk} />
                  <span className="text-xs font-mono text-cmd-muted">{item.id}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Investigations table */}
        <Card className="col-span-2 p-5">
          <SectionHeader title="Recent Investigations" />
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-cmd-muted border-b border-cmd-border">
                  {['Case ID', 'Fraud Type', 'Phone', 'Cluster', 'Confidence', 'Status'].map((h) => (
                    <th key={h} className="text-left pb-2 pr-4 uppercase tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cmd-border/50">
                {MOCK_INVESTIGATIONS.map((inv) => (
                  <tr key={inv.case_id} className="hover:bg-cmd-bg/50 transition-colors">
                    <td className="py-2.5 pr-4 text-cmd-accent">#{inv.case_id}</td>
                    <td className="pr-4 text-cmd-text">{inv.type}</td>
                    <td className="pr-4 text-cmd-subtext">{inv.suspect_phone}</td>
                    <td className="pr-4">
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">
                        {inv.cluster}
                      </span>
                    </td>
                    <td className="pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-cmd-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cmd-accent rounded-full"
                            style={{ width: `${inv.confidence}%` }}
                          />
                        </div>
                        <span className="text-cmd-text">{inv.confidence}%</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          inv.status === 'ACTIVE'
                            ? 'bg-cmd-danger/10 text-cmd-danger border-cmd-danger/20'
                            : inv.status === 'REVIEWING'
                            ? 'bg-cmd-warn/10 text-cmd-warn border-cmd-warn/20'
                            : 'bg-cmd-muted/10 text-cmd-muted border-cmd-muted/20'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}