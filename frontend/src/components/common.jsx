import React from 'react'

// ─── Design tokens (inject into :root via index.css or App.jsx) ──────────────
//
//  --color-bg            #0d0f14
//  --color-surface       #141720
//  --color-card          #1a1e2a
//  --color-elevated      #1f2435
//  --color-border        #252a38
//  --color-border-md     #2e3447
//  --color-text-primary  #e8eaf0
//  --color-text-secondary#8b90a0
//  --color-text-muted    #545870
//  --color-accent        #3b7cf4
//  --color-accent-dim    rgba(59,124,244,.12)
//  --color-accent-border rgba(59,124,244,.25)
//  --color-danger        #ef4444
//  --color-danger-dim    rgba(239,68,68,.10)
//  --color-warning       #f59e0b
//  --color-warning-dim   rgba(245,158,11,.10)
//  --color-success       #22c55e
//  --color-success-dim   rgba(34,197,94,.10)
//  --font-sans           -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
//  --font-mono           'JetBrains Mono', 'Fira Code', monospace
//  --radius-sm           6px
//  --radius-md           10px
//  --radius-lg           14px
//  --transition          150ms ease
//  --shadow-md           0 4px 16px rgba(0,0,0,.4)

// ─── PageWrapper ──────────────────────────────────────────────────────────────
export function PageWrapper({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: '100%' }}>
      {children}
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, badge }) {
  return (
    <div style={{ marginBottom: subtitle ? 16 : 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: subtitle ? 5 : 0 }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
          {title}
        </span>
        {badge && (
          <span style={{
            padding: '2px 8px', borderRadius: 99,
            background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)',
            color: 'var(--color-accent)', fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.1em',
          }}>
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  const dim = size === 'lg' ? 38 : size === 'sm' ? 14 : 22
  return (
    <div style={{
      width: dim, height: dim, borderRadius: '50%',
      border: '2px solid var(--color-border-md)',
      borderTopColor: 'var(--color-accent)',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  )
}

// ─── KpiCard ──────────────────────────────────────────────────────────────────
const KPI_COLORS = {
  accent:  { color: 'var(--color-accent)',  bg: 'var(--color-accent-dim)',  border: 'var(--color-accent-border)' },
  danger:  { color: 'var(--color-danger)',  bg: 'var(--color-danger-dim)',  border: 'rgba(239,68,68,0.25)' },
  warn:    { color: 'var(--color-warning)', bg: 'var(--color-warning-dim)', border: 'rgba(245,158,11,0.25)' },
  success: { color: 'var(--color-success)', bg: 'var(--color-success-dim)', border: 'rgba(34,197,94,0.25)' },
  purple:  { color: '#a78bfa',             bg: 'rgba(167,139,250,0.10)',   border: 'rgba(167,139,250,0.22)' },
}

export function KpiCard({ label, value, icon: Icon, color = 'accent', sublabel }) {
  const c = KPI_COLORS[color] ?? KPI_COLORS.accent
  return (
    <Card style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: 'var(--color-text-muted)', marginBottom: 7,
          }}>
            {label}
          </div>
          <div style={{
            fontSize: '1.625rem', fontWeight: 700, color: 'var(--color-text-primary)',
            lineHeight: 1, letterSpacing: '-0.025em', marginBottom: 6,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {value}
          </div>
          {sublabel && (
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
              {sublabel}
            </div>
          )}
        </div>
        {Icon && (
          <div style={{
            width: 34, height: 34, flexShrink: 0,
            borderRadius: 'var(--radius-sm)',
            background: c.bg, border: `1px solid ${c.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color,
          }}>
            <Icon style={{ fontSize: 17 }} />
          </div>
        )}
      </div>
    </Card>
  )
}

// ─── RiskBadge ────────────────────────────────────────────────────────────────
const RISK_STYLES = {
  CRITICAL: { bg: 'rgba(239,68,68,0.12)',  color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  HIGH:     { bg: 'rgba(249,115,22,0.12)', color: '#fb923c', border: 'rgba(249,115,22,0.3)' },
  MEDIUM:   { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  LOW:      { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
}

export function RiskBadge({ level }) {
  const s = RISK_STYLES[level] ?? { bg: 'var(--color-elevated)', color: 'var(--color-text-muted)', border: 'var(--color-border)' }
  return (
    <span style={{
      padding: '2px 7px', borderRadius: 'var(--radius-sm)',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
      fontWeight: 700, letterSpacing: '0.06em',
    }}>
      {level}
    </span>
  )
}

// ─── CmdButton ────────────────────────────────────────────────────────────────
export function CmdButton({ children, className = '', loading = false, disabled = false, style = {}, ...props }) {
  const isDisabled = disabled || loading
  return (
    <button
      {...props}
      disabled={isDisabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 7, padding: '8px 18px',
        background: isDisabled ? 'var(--color-elevated)' : 'var(--color-accent)',
        color: isDisabled ? 'var(--color-text-muted)' : '#fff',
        border: `1px solid ${isDisabled ? 'var(--color-border)' : 'var(--color-accent)'}`,
        borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)',
        fontSize: '0.8125rem', fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--transition), opacity var(--transition)',
        opacity: isDisabled ? 0.45 : 1,
        ...style,
      }}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  )
}

// ─── CmdTextarea ──────────────────────────────────────────────────────────────
export function CmdTextarea({ label, ...props }) {
  return (
    <div>
      {label && (
        <label style={{
          display: 'block', marginBottom: 6,
          fontSize: '0.625rem', fontWeight: 500,
          color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          {label}
        </label>
      )}
      <textarea
        {...props}
        style={{
          width: '100%', background: 'var(--color-elevated)',
          border: '1px solid var(--color-border-md)', borderRadius: 'var(--radius-sm)',
          padding: '10px 12px', fontSize: '0.875rem', fontFamily: 'var(--font-sans)',
          color: 'var(--color-text-primary)', resize: 'vertical', outline: 'none',
          lineHeight: 1.6, boxSizing: 'border-box',
          transition: 'border-color var(--transition), box-shadow var(--transition)',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'var(--color-accent)'
          e.target.style.boxShadow = '0 0 0 3px var(--color-accent-dim)'
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--color-border-md)'
          e.target.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}

// ─── ScoreBar ─────────────────────────────────────────────────────────────────
export function ScoreBar({ value = 0, color = 'var(--color-accent)' }) {
  return (
    <div style={{ width: '100%', height: 4, background: 'var(--color-border)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${Math.min(100, Math.max(0, value))}%`,
        background: color, borderRadius: 99,
        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  )
}

// ─── Alert ────────────────────────────────────────────────────────────────────
const ALERT_STYLES = {
  danger:  { bg: 'var(--color-danger-dim)',  border: 'rgba(239,68,68,0.3)',        color: '#fca5a5' },
  warn:    { bg: 'var(--color-warning-dim)', border: 'rgba(245,158,11,0.3)',       color: '#fcd34d' },
  success: { bg: 'var(--color-success-dim)', border: 'rgba(34,197,94,0.3)',        color: '#86efac' },
  info:    { bg: 'var(--color-accent-dim)',  border: 'var(--color-accent-border)', color: '#93c5fd' },
}

export function Alert({ children, type = 'info' }) {
  const s = ALERT_STYLES[type] ?? ALERT_STYLES.info
  return (
    <div style={{
      padding: '11px 15px', borderRadius: 'var(--radius-md)',
      background: s.bg, border: `1px solid ${s.border}`,
      color: s.color, fontSize: '0.8125rem', lineHeight: 1.55,
    }}>
      {children}
    </div>
  )
}

// ─── MonoLabel ────────────────────────────────────────────────────────────────
export function MonoLabel({ children, style = {} }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
      textTransform: 'uppercase', letterSpacing: '0.12em',
      color: 'var(--color-text-muted)', ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Global keyframes ─────────────────────────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('common-keyframes')) {
  const style = document.createElement('style')
  style.id = 'common-keyframes'
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  `
  document.head.appendChild(style)
}
