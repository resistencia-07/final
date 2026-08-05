import { useState } from 'react'
import type { ReactNode } from 'react'

interface NavItem {
  id: string
  icon: ReactNode
  label: string
  badge?: string | number
}

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
}

const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  capture: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 10l4.553-2.07A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14"/>
      <rect x="3" y="8" width="12" height="8" rx="2"/>
      <circle cx="17.5" cy="5.5" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  athletes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  reports: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
}

const navItems: NavItem[] = [
  { id: 'dashboard', icon: icons.dashboard, label: 'Dashboard' },
  { id: 'capture',   icon: icons.capture,   label: 'Capture Lab', badge: 'LIVE' },
  { id: 'athletes',  icon: icons.athletes,  label: 'Athletes' },
  { id: 'reports',   icon: icons.reports,   label: 'Reports' },
  { id: 'profile',   icon: icons.profile,   label: 'Profile' },
  { id: 'settings',  icon: icons.settings,  label: 'Settings' },
]

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Spider Web Background */}
      <svg className="sidebar-web" viewBox="0 0 240 800" preserveAspectRatio="none">
        {[60, 100, 140, 180, 220].map((r, i) => (
          <circle key={i} cx="0" cy="0" r={r} className="web-circle" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return <line key={i} x1="0" y1="0" x2={Math.cos(rad) * 300} y2={Math.sin(rad) * 800} className="web-line" style={{ animationDelay: `${i * 0.15}s` }} />
        })}
      </svg>

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke="hsl(0,90%,55%)" strokeWidth="1.5" strokeDasharray="4 2"/>
            <circle cx="16" cy="16" r="6" fill="hsl(0,90%,55%)" opacity="0.9"/>
            <line x1="16" y1="1"  x2="16" y2="31" stroke="hsl(0,90%,55%)" strokeWidth="0.8" opacity="0.4"/>
            <line x1="1"  y1="16" x2="31" y2="16" stroke="hsl(0,90%,55%)" strokeWidth="0.8" opacity="0.4"/>
            <line x1="4"  y1="4"  x2="28" y2="28" stroke="hsl(0,90%,55%)" strokeWidth="0.8" opacity="0.3"/>
            <line x1="28" y1="4"  x2="4"  y2="28" stroke="hsl(0,90%,55%)" strokeWidth="0.8" opacity="0.3"/>
          </svg>
        </div>
        {!collapsed && (
          <div className="logo-text">
            <span className="logo-title">Ndurance</span>
            <span className="logo-sub">Sports Lab</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {!collapsed && item.badge && (
              <span className="nav-badge">{item.badge}</span>
            )}
            {activePage === item.id && <span className="nav-active-bar" />}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button className="sidebar-collapse" onClick={() => setCollapsed(c => !c)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 300ms' }}>
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
    </aside>
  )
}
