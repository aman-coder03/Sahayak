import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  MdSpaceDashboard,
  MdShield,
  MdBiotech,
  MdHub,
  MdSmartToy,
  MdFolder,
  MdInsights,
  MdNotificationsNone,
  MdFiberManualRecord,
  MdChevronLeft,
} from "react-icons/md";

const NAV = [
  {
    section: "Overview",
    items: [{ to: "/", label: "Command Dashboard", icon: MdSpaceDashboard, end: true }],
  },
  {
    section: "Citizen Protection",
    items: [{ to: "/shield", label: "Citizen Shield", icon: MdShield }],
  },
  {
    section: "Intelligence",
    items: [
      { to: "/dna", label: "Fraud DNA Lab", icon: MdBiotech },
      { to: "/intelligence", label: "Crime Intelligence", icon: MdInsights },
      { to: "/network", label: "Fraud Network", icon: MdHub },
    ],
  },
  {
    section: "Casework",
    items: [
      { to: "/copilot", label: "Investigator Copilot", icon: MdSmartToy },
      { to: "/evidence", label: "Evidence Center", icon: MdFolder },
    ],
  },
];

const TITLES = {
  "/": ["Command Dashboard", "Real-time threat intelligence · NCRB integrated"],
  "/shield": ["Citizen Shield", "AI-powered scam detection for the public"],
  "/dna": ["Fraud DNA Lab", "Cryptographic fraud fingerprinting"],
  "/copilot": ["Investigator Copilot", "AI-assisted case intelligence"],
  "/intelligence": ["Crime Intelligence", "Spatial clustering & hotspot analysis"],
  "/evidence": ["Evidence Center", "Court-admissible evidence packages"],
  "/network": ["Fraud Network", "Link analysis & cluster attribution"],
};

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="mono text-[11px] text-tx-muted">
      {now.toLocaleTimeString("en-IN", { hour12: false })} IST
    </span>
  );
}

export default function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [title, subtitle] = TITLES[location.pathname] ?? ["SAHAYAK", ""];

  return (
    <div className="flex h-screen bg-bg-1 cmd-grid">
      {/* Sidebar */}
      <aside
        className={`flex flex-shrink-0 flex-col border-r border-border bg-bg-2 transition-all duration-200 ${
          collapsed ? "w-[68px]" : "w-60"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-brand-bg border border-brand-border">
            <MdShield className="text-brand text-lg" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-display text-sm font-bold leading-tight text-tx-h tracking-wide">
                SAHAYAK
              </div>
              <div className="truncate text-[9px] uppercase tracking-widest text-tx-dim">
                Cybercrime Intelligence
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5">
          {NAV.map((group) => (
            <div key={group.section}>
              {!collapsed && (
                <div className="px-2.5 mb-1.5 text-[9px] font-semibold uppercase tracking-widest text-tx-dim">
                  {group.section}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-brand-bg text-brand"
                          : "text-tx-muted hover:bg-bg-3 hover:text-tx"
                      }`
                    }
                    title={collapsed ? label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r bg-brand transition-opacity ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <Icon className="text-base flex-shrink-0" />
                        {!collapsed && <span className="truncate">{label}</span>}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="mx-2.5 mb-2 flex items-center justify-center gap-2 rounded-md border border-border py-1.5 text-[10px] text-tx-dim hover:border-border-2 hover:text-tx-muted transition-colors"
        >
          <MdChevronLeft className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
          {!collapsed && "Collapse"}
        </button>

        {/* System status */}
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center gap-1.5">
            <MdFiberManualRecord className="text-ok text-[8px] animate-pulse2" />
            {!collapsed && <span className="text-[10px] font-medium text-ok">All systems operational</span>}
          </div>
          {!collapsed && <div className="mt-0.5 text-[9px] text-tx-dim mono">v2.4.1 · MHA / CERT-In</div>}
        </div>
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-border bg-bg-2/80 px-5 py-3 backdrop-blur flex-shrink-0">
          <div className="min-w-0">
            <h1 className="font-display text-sm font-semibold text-tx-h truncate">{title}</h1>
            {subtitle && <p className="text-[11px] text-tx-muted mt-0.5 truncate">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <Clock />

            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-danger-border bg-danger-bg px-3 py-1">
              <MdFiberManualRecord className="text-danger text-[8px] animate-pulse2" />
              <span className="text-[10px] font-semibold tracking-wide text-danger">THREAT: SEVERE</span>
            </div>

            <button className="relative text-tx-muted hover:text-tx transition-colors">
              <MdNotificationsNone className="text-lg" />
              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-brand" />
            </button>

            <div className="flex items-center gap-2 border-l border-border pl-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-bg border border-violet-border text-[10px] font-bold text-violet">
                A1
              </div>
              <div className="hidden md:block leading-tight">
                <div className="text-[11px] font-medium text-tx">Analyst 01</div>
                <div className="text-[9px] text-tx-dim">Cyber Cell · L2 Clearance</div>
              </div>
            </div>
          </div>
        </header>

        {/* Routed page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
