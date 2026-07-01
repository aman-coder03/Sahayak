import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MdDashboard, MdShield, MdBiotech, MdSmartToy,
  MdMap, MdFolder, MdHub, MdWarning,
} from "react-icons/md";
import { RiRadarLine } from "react-icons/ri";

const NAV = [
  { to: "/", icon: MdDashboard, label: "Dashboard" },
  { to: "/shield", icon: MdShield, label: "Citizen Shield" },
  { to: "/dna", icon: MdBiotech, label: "Fraud DNA Lab" },
  { to: "/copilot", icon: MdSmartToy, label: "Investigator Copilot" },
  { to: "/intelligence", icon: MdMap, label: "Crime Intelligence" },
  { to: "/evidence", icon: MdFolder, label: "Evidence Center" },
  { to: "/network", icon: MdHub, label: "Fraud Network" },
];

export default function AppLayout() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toUTCString().slice(17, 25) + " IST");
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-tx">
      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 bg-bg-2 border-r border-border flex flex-col">
        {/* Logo */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center flex-shrink-0">
              <RiRadarLine className="text-white text-sm" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-wide">SAHAYAK</div>
              <div className="text-[9px] text-tx-dim leading-none">MHA · CERT-In Platform</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2 overflow-y-auto">
          <div className="px-3 pt-2 pb-1 section-label">Modules</div>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 mx-1.5 px-2.5 py-2 rounded-md text-xs transition-all duration-150 mb-0.5 ${
                  isActive
                    ? "bg-blue-950 text-blue-300 font-medium"
                    : "text-tx-muted hover:bg-bg-3 hover:text-tx"
                }`
              }
            >
              <Icon className="text-sm flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom stats */}
        <div className="p-3 border-t border-border space-y-1.5">
          <div className="section-label mb-2">System Status</div>
          {[
            ["Scam Precision", "94.2%", "text-ok"],
            ["CV Accuracy", "97.3%", "text-ok"],
            ["Citizen FPR", "1.8%", "text-ok"],
            ["Net Lead Time", "4.2 hrs", "text-brand"],
          ].map(([k, v, c]) => (
            <div key={k} className="flex justify-between items-center text-[10px]">
              <span className="text-tx-muted">{k}</span>
              <span className={`font-semibold ${c}`}>{v}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-11 flex-shrink-0 bg-bg-2 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MdWarning className="text-warn text-sm" />
            <span className="text-xs text-tx-muted">
              Threat Level: <span className="text-danger font-semibold">SEVERE</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-tx-muted">
            <span>analyst_01</span>
            <span className="text-border-2">|</span>
            <span className="mono">{time}</span>
            <span className="text-border-2">|</span>
            <span className="flex items-center gap-1.5 text-ok">
              <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse2 inline-block" />
              LIVE
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
