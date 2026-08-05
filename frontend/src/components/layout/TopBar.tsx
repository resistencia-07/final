
interface TopBarProps {
  title: string
  subtitle?: string
  onNavigate?: (page: string) => void
}

export default function TopBar({ title, subtitle, onNavigate }: TopBarProps) {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-titles">
          <h4 className="topbar-title">{title}</h4>
          {subtitle && <span className="topbar-sub">{subtitle}</span>}
        </div>
      </div>

      <div className="topbar-right">
        {/* System Status */}
        <div className="status-pill">
          <span className="live-dot" />
          <span>Studio Online</span>
        </div>

        {/* Camera status */}
        <div className="topbar-cameras">
          {['CAM-1', 'CAM-2', 'CAM-3'].map((cam, i) => (
            <div key={cam} className="cam-chip" style={{ animationDelay: `${i * 0.1}s` }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5"/>
              </svg>
              {cam}
            </div>
          ))}
        </div>

        {/* Clock */}
        <div className="topbar-clock">
          <span className="clock-time">{time}</span>
          <span className="clock-date">{date}</span>
        </div>

        {/* Avatar */}
        <div
          className="topbar-avatar"
          role="button"
          tabIndex={0}
          aria-label="Open profile"
          onClick={() => onNavigate?.('profile')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onNavigate?.('profile')
            }
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>
    </header>
  )
}
