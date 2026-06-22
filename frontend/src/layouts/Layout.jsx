import { Outlet, NavLink } from 'react-router-dom'
import {
  MdDashboard,
  MdShield,
  MdBiotech,
  MdSmartToy,
  MdMap,
  MdFolder,
  MdBubbleChart,
  MdWarning,
} from 'react-icons/md'
import { useState } from 'react'

const NAV = [
  { to: '/', icon: MdDashboard, label: 'Command Center', exact: true },
  { to: '/shield', icon: MdShield, label: 'Citizen Shield' },
  { to: '/dna-lab', icon: MdBiotech, label: 'Fraud DNA Lab' },
  { to: '/copilot', icon: MdSmartToy, label: 'AI Copilot' },
  { to: '/intelligence', icon: MdMap, label: 'Crime Intelligence' },
  { to: '/evidence', icon: MdFolder, label: 'Evidence Center' },
  { to: '/network', icon: MdBubbleChart, label: 'Fraud Network' },
]

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-cmd-bg overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-cmd-surface border-r border-cmd-border transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-cmd-border">
          <div className="flex-shrink-0 w-8 h-8 rounded bg-cmd-accent flex items-center justify-center">
            <MdWarning className="text-cmd-bg text-lg" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-mono font-bold text-cmd-accent text-sm tracking-widest">
                SAHAYAK
              </div>
              <div className="text-cmd-subtext text-xs tracking-wide">
                CYBER INTEL
              </div>
            </div>
          )}
        </div>

        {/* Status badge */}
        {!collapsed && (
          <div className="mx-3 my-3 px-3 py-1.5 bg-cmd-success/10 border border-cmd-success/20 rounded text-cmd-success text-xs font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cmd-success animate-pulse-slow inline-block" />
            SYSTEM ONLINE
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors group ${
                  isActive
                    ? 'bg-cmd-accent/10 text-cmd-accent border border-cmd-accent/20'
                    : 'text-cmd-subtext hover:text-cmd-text hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <Icon className="text-lg flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="m-3 px-3 py-2 text-cmd-subtext hover:text-cmd-text text-xs font-mono border border-cmd-border rounded hover:border-cmd-accent/30 transition-colors"
        >
          {collapsed ? '›' : '‹ COLLAPSE'}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-12 flex items-center justify-between px-6 border-b border-cmd-border bg-cmd-surface/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3 text-xs font-mono text-cmd-subtext">
            <span className="text-cmd-accent">▸</span>
            <span>DIGITAL PUBLIC SAFETY INTELLIGENCE PLATFORM</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cmd-subtext">
              <span className="w-1.5 h-1.5 rounded-full bg-cmd-danger animate-pulse inline-block" />
              <span className="text-cmd-warn font-semibold">THREAT: ELEVATED</span>
            </div>
            <div className="text-xs font-mono text-cmd-muted">
              {new Date().toUTCString().slice(0, 25)} UTC
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto cmd-grid">
          <Outlet />
        </main>
      </div>
    </div>
  )
}