import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  MdDashboard, MdShield, MdBiotech, MdSmartToy,
  MdMap, MdFolder, MdBubbleChart, MdWarning,
  MdChevronLeft, MdChevronRight, MdNotifications, MdSearch,
} from 'react-icons/md'
import { useState, useEffect } from 'react'

const NAV = [
  { to: '/',            icon: MdDashboard,   label: 'Command Center',    exact: true },
  { to: '/shield',      icon: MdShield,      label: 'Citizen Shield' },
  { to: '/dna-lab',     icon: MdBiotech,     label: 'Fraud DNA Lab' },
  { to: '/copilot',     icon: MdSmartToy,    label: 'AI Copilot' },
  { to: '/intelligence',icon: MdMap,         label: 'Crime Intelligence' },
  { to: '/evidence',    icon: MdFolder,      label: 'Evidence Center' },
  { to: '/network',     icon: MdBubbleChart, label: 'Fraud Network' },
]

const PAGE_LABELS = {
  '/': 'Command Center', '/shield': 'Citizen Shield', '/dna-lab': 'Fraud DNA Lab',
  '/copilot': 'AI Copilot', '/intelligence': 'Crime Intelligence',
  '/evidence': 'Evidence Center', '/network': 'Fraud Network',
}

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>
      {now.toUTCString().slice(0, 25)} UTC
    </span>
  )
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const pageLabel = PAGE_LABELS[location.pathname] ?? 'SAHAYAK'

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg)', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? 54 : 220,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        transition: 'width 240ms cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}>

        {/* Logo */}
        <div style={{
          height: 52,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: collapsed ? '0 13px' : '0 16px',
          borderBottom: '1px solid var(--color-border)',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          <div style={{
            width: 28, height: 28, flexShrink: 0,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MdWarning style={{ color: '#fff', fontSize: 15 }} />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontWeight: 700,
                color: 'var(--color-text-primary)', fontSize: '0.8125rem',
                letterSpacing: '0.12em', whiteSpace: 'nowrap',
              }}>SAHAYAK</div>
              <div style={{
                fontSize: '0.5625rem', color: 'var(--color-text-muted)',
                letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap',
              }}>Cyber Intel</div>
            </div>
          )}
        </div>

        {/* System status */}
        {!collapsed && (
          <div style={{
            margin: '10px 10px 4px', padding: '6px 10px',
            background: 'var(--color-success-dim)', border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--color-success)', flexShrink: 0,
              boxShadow: '0 0 6px var(--color-success)',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--color-success)', letterSpacing: '0.1em' }}>
              SYSTEM ONLINE
            </span>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {!collapsed && (
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
              color: 'var(--color-text-muted)', letterSpacing: '0.12em',
              textTransform: 'uppercase', padding: '10px 8px 5px',
            }}>Navigation</div>
          )}
          {NAV.map(({ to, icon: Icon, label, exact }) => (
            <NavLink key={to} to={to} end={exact} title={collapsed ? label : undefined} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: 9,
                  padding: collapsed ? '9px 0' : '7px 10px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--color-accent-border)' : 'transparent',
                  background: isActive ? 'var(--color-accent-dim)' : 'transparent',
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  borderLeft: isActive && !collapsed ? '2px solid var(--color-accent)' : '2px solid transparent',
                  fontSize: '0.8125rem', fontWeight: isActive ? 500 : 400,
                  transition: 'background var(--transition), color var(--transition), border-color var(--transition)',
                  cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden',
                }}>
                  <Icon style={{ fontSize: 15, flexShrink: 0, opacity: isActive ? 1 : 0.55 }} />
                  {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            margin: '8px', padding: '7px',
            background: 'transparent', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 6,
            transition: 'background var(--transition), color var(--transition)', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-elevated)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
        >
          {collapsed
            ? <MdChevronRight style={{ fontSize: 15 }} />
            : <>
                <MdChevronLeft style={{ fontSize: 15 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em' }}>COLLAPSE</span>
              </>
          }
        </button>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          height: 52, flexShrink: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)' }}>
            <span>SAHAYAK</span>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <span style={{ color: 'var(--color-text-primary)' }}>{pageLabel}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
              borderRadius: 'var(--radius-sm)', background: 'var(--color-danger-dim)',
              border: '1px solid rgba(239,68,68,0.25)',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-danger)', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-danger)', fontWeight: 600, letterSpacing: '0.06em' }}>
                THREAT: ELEVATED
              </span>
            </div>

            <Clock />

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {[MdSearch, MdNotifications].map((Icon, i) => (
                <button key={i} style={{
                  width: 30, height: 30, borderRadius: 'var(--radius-sm)',
                  background: 'transparent', border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  position: 'relative', transition: 'background var(--transition), color var(--transition)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-elevated)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                >
                  <Icon style={{ fontSize: 14 }} />
                  {i === 1 && (
                    <span style={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: '50%', background: 'var(--color-danger)', border: '1.5px solid var(--color-surface)' }} />
                  )}
                </button>
              ))}
              <div style={{
                width: 28, height: 28, marginLeft: 4, borderRadius: 'var(--radius-sm)',
                background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)',
                color: 'var(--color-accent)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '0.5625rem', fontWeight: 700,
                letterSpacing: '0.06em', cursor: 'pointer',
              }}>OP</div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '22px 24px' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--color-border-md); border-radius: 2px; }
      `}</style>
    </div>
  )
}
