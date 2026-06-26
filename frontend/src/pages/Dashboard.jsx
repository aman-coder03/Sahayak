import { useEffect, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import {
  MdWarningAmber, MdBugReport, MdOutlineSpeed, MdHub,
  MdCircle, MdArrowForward,
} from 'react-icons/md'
import { getDashboardSummary } from '../services/api'
import { KpiCard, SectionHeader, Card, RiskBadge, PageWrapper, Spinner } from '../components/common'

// ── Static data ───────────────────────────────────────────────────────────────

const MOCK_CHART = [
  { time: '00:00', scams: 12, fraud: 8,  arrests: 3  },
  { time: '04:00', scams: 5,  fraud: 4,  arrests: 1  },
  { time: '08:00', scams: 18, fraud: 14, arrests: 7  },
  { time: '12:00', scams: 34, fraud: 22, arrests: 11 },
  { time: '16:00', scams: 28, fraud: 19, arrests: 9  },
  { time: '20:00', scams: 41, fraud: 30, arrests: 14 },
  { time: '23:59', scams: 22, fraud: 17, arrests: 6  },
]

const FRAUD_TYPES = [
  { type: 'Digital Arrest', count: 41 },
  { type: 'UPI Fraud',      count: 34 },
  { type: 'KYC Scam',       count: 28 },
  { type: 'Vishing',        count: 19 },
  { type: 'SIM Swap',       count: 12 },
]

const MOCK_FEED = [
  { id: 'C-2841', type: 'Digital Arrest', risk: 'CRITICAL', city: 'Mumbai',    time: '2m ago'  },
  { id: 'C-2840', type: 'UPI Fraud',      risk: 'HIGH',     city: 'Delhi',     time: '7m ago'  },
  { id: 'C-2839', type: 'KYC Scam',       risk: 'HIGH',     city: 'Bangalore', time: '12m ago' },
  { id: 'C-2838', type: 'FedEx Scam',     risk: 'MEDIUM',   city: 'Hyderabad', time: '19m ago' },
  { id: 'C-2837', type: 'Vishing',        risk: 'MEDIUM',   city: 'Chennai',   time: '31m ago' },
  { id: 'C-2836', type: 'SIM Swap',       risk: 'HIGH',     city: 'Pune',      time: '45m ago' },
]

const MOCK_INVESTIGATIONS = [
  { case_id: 2841, type: 'Digital Arrest Scam', suspect_phone: '+91-98765-XXXXX', cluster: 'C-7', confidence: 94, status: 'ACTIVE'    },
  { case_id: 2840, type: 'UPI Chain Fraud',      suspect_phone: '+91-91234-XXXXX', cluster: 'C-3', confidence: 87, status: 'ACTIVE'    },
  { case_id: 2839, type: 'KYC Impersonation',    suspect_phone: '+91-76543-XXXXX', cluster: 'C-7', confidence: 81, status: 'REVIEWING' },
  { case_id: 2835, type: 'FedEx Courier Scam',   suspect_phone: '+91-88990-XXXXX', cluster: 'C-1', confidence: 76, status: 'CLOSED'    },
]

// ── Shared style objects ──────────────────────────────────────────────────────

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--color-elevated)',
  border: '1px solid var(--color-border-md)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  boxShadow: 'var(--shadow-md)',
}

const RISK_DOT = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#f59e0b' }

const STATUS_STYLE = {
  ACTIVE:    { bg: 'var(--color-danger-dim)',  color: 'var(--color-danger)',  border: 'rgba(239,68,68,0.25)'  },
  REVIEWING: { bg: 'var(--color-warning-dim)', color: 'var(--color-warning)', border: 'rgba(245,158,11,0.25)' },
  CLOSED:    { bg: 'var(--color-elevated)',    color: 'var(--color-text-muted)', border: 'var(--color-border)' },
}

// ── Micro components ──────────────────────────────────────────────────────────

function ConfidenceBar({ value }) {
  const color = value >= 90 ? 'var(--color-danger)' : value >= 80 ? 'var(--color-warning)' : 'var(--color-accent)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <div style={{ width: 50, height: 3, background: 'var(--color-border)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-primary)' }}>
        {value}%
      </span>
    </div>
  )
}

function ClusterPill({ label }) {
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 'var(--radius-sm)',
      background: 'rgba(167,139,250,0.08)', color: '#a78bfa',
      border: '1px solid rgba(167,139,250,0.2)',
      fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
    }}>
      {label}
    </span>
  )
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.CLOSED
  return (
    <span style={{
      padding: '2px 7px', borderRadius: 'var(--radius-sm)',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
      fontWeight: 700, letterSpacing: '0.06em',
    }}>
      {status}
    </span>
  )
}

// ── Shared cell style ─────────────────────────────────────────────────────────
const TD = { padding: '9px 10px', borderBottom: '1px solid var(--color-border)', verticalAlign: 'middle' }
const TH = {
  fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', textTransform: 'uppercase',
  letterSpacing: '0.1em', color: 'var(--color-text-muted)', padding: '0 10px 10px',
  borderBottom: '1px solid var(--color-border)', textAlign: 'left', whiteSpace: 'nowrap',
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

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

      {/* ── Hero ── */}
      <div style={{
        position: 'relative', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)', overflow: 'hidden', padding: '24px 28px',
      }}>
        {/* Accent gradient */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '45%', height: '100%',
          background: 'linear-gradient(to left, rgba(59,124,244,0.05), transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--color-accent)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              ▸ SAHAYAK v1.0 — Active Monitoring
            </span>
            <span style={{
              padding: '2px 8px', borderRadius: 99,
              background: 'var(--color-success-dim)', border: '1px solid rgba(34,197,94,0.2)',
              color: 'var(--color-success)', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em',
            }}>LIVE</span>
          </div>
          <div style={{ fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--color-text-primary)', marginBottom: 5, lineHeight: 1.25 }}>
            Real-Time <span style={{ color: 'var(--color-accent)' }}>Cyber Fraud</span> Intelligence
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: 18 }}>
            National monitoring system — active cases, threat clusters, and field investigations
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            {[
              { label: 'Total Cases',    value: summary?.total_cases?.toLocaleString() ?? '2,841' },
              { label: 'High Risk',      value: summary?.high_risk_cases ?? '184', color: 'var(--color-danger)' },
              { label: 'Arrests Today', value: '23' },
              { label: 'Coverage',      value: '28 States' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 3 }}>
                  {label}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: color ?? 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                  {loading ? '—' : value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI row ── */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
          <Spinner size="lg" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          <KpiCard label="Active Cases"    value={summary?.total_cases?.toLocaleString() ?? '2,841'} icon={MdWarningAmber} color="accent"  sublabel="+12% from last week" />
          <KpiCard label="High Risk Cases" value={summary?.high_risk_cases ?? '184'}                  icon={MdBugReport}    color="danger"  sublabel="Requiring immediate action" />
          <KpiCard label="Threat Index"    value="7.4"                                                icon={MdOutlineSpeed} color="warn"    sublabel="National cyber threat index" />
          <KpiCard label="Active Clusters" value="14"                                                 icon={MdHub}          color="purple"  sublabel="Fraud network clusters" />
        </div>
      )}

      {/* ── Charts row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>

        {/* Area: 24H activity */}
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Threat Activity — 24H" badge="LIVE" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_CHART} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="scamGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" />
              <XAxis dataKey="time" tick={{ fill: 'var(--color-text-muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="scams"   stroke="#3b82f6" fill="url(#scamGrad)"  strokeWidth={1.5} dot={false} name="Scams" />
              <Area type="monotone" dataKey="fraud"   stroke="#ef4444" fill="url(#fraudGrad)" strokeWidth={1.5} dot={false} name="Fraud" />
              <Area type="monotone" dataKey="arrests" stroke="#22c55e" fill="none"             strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Arrests" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
            {[
              { color: '#3b82f6', label: 'Scams' },
              { color: '#ef4444', label: 'Fraud' },
              { color: '#22c55e', label: 'Arrests', dashed: true },
            ].map(({ color, label, dashed }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: 18, height: 2,
                  background: dashed
                    ? `repeating-linear-gradient(to right, ${color} 0, ${color} 4px, transparent 4px, transparent 8px)`
                    : color,
                }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--color-text-muted)' }}>{label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Bar: fraud types */}
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Fraud Types" />
          <div style={{ marginTop: 4 }}>
            {FRAUD_TYPES.map(({ type, count }) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-secondary)', width: 96, textAlign: 'right', flexShrink: 0 }}>
                  {type}
                </span>
                <div style={{ flex: 1, height: 6, background: 'var(--color-border)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${(count / 41 * 100).toFixed(0)}%`, height: '100%', background: 'rgba(59,124,244,0.7)', borderRadius: 99 }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-secondary)', width: 22, textAlign: 'right', flexShrink: 0 }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Bottom row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>

        {/* Live threat feed */}
        <Card style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
          <SectionHeader title="Live Threat Feed" badge="REAL-TIME" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {MOCK_FEED.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '7px 10px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                  transition: 'border-color var(--transition)', cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-md)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                <MdCircle style={{ fontSize: 7, flexShrink: 0, color: RISK_DOT[item.risk] ?? '#6b7280' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.type}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: 1 }}>
                    {item.city} · {item.time}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                  <RiskBadge level={item.risk} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--color-text-muted)' }}>{item.id}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Investigations table */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <SectionHeader title="Recent Investigations" />
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
              color: 'var(--color-accent)', padding: '4px 0',
            }}>
              View all <MdArrowForward style={{ fontSize: 11 }} />
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Case ID', 'Fraud Type', 'Phone', 'Cluster', 'Confidence', 'Status'].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_INVESTIGATIONS.map((inv, idx) => (
                  <tr key={inv.case_id}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ ...TD, borderBottom: idx === MOCK_INVESTIGATIONS.length - 1 ? 'none' : TD.borderBottom }}>
                      <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>#{inv.case_id}</span>
                    </td>
                    <td style={{ ...TD, borderBottom: idx === MOCK_INVESTIGATIONS.length - 1 ? 'none' : TD.borderBottom, color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '0.8125rem' }}>
                      {inv.type}
                    </td>
                    <td style={{ ...TD, borderBottom: idx === MOCK_INVESTIGATIONS.length - 1 ? 'none' : TD.borderBottom }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{inv.suspect_phone}</span>
                    </td>
                    <td style={{ ...TD, borderBottom: idx === MOCK_INVESTIGATIONS.length - 1 ? 'none' : TD.borderBottom }}>
                      <ClusterPill label={inv.cluster} />
                    </td>
                    <td style={{ ...TD, borderBottom: idx === MOCK_INVESTIGATIONS.length - 1 ? 'none' : TD.borderBottom }}>
                      <ConfidenceBar value={inv.confidence} />
                    </td>
                    <td style={{ ...TD, borderBottom: idx === MOCK_INVESTIGATIONS.length - 1 ? 'none' : TD.borderBottom }}>
                      <StatusBadge status={inv.status} />
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
