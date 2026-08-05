import { useState, useEffect } from 'react'
import GlassCard from '../components/ui/GlassCard'
import MetricCard from '../components/ui/MetricCard'
import Button from '../components/ui/Button'

interface DashboardProps {
  onNavigate: (page: string) => void
}

const recentSessions = [
  { id: 1, athlete: 'Marcus Johnson', type: 'Sprint Analysis', duration: '12:34', score: 94, time: '2h ago', status: 'complete' },
  { id: 2, athlete: 'Aisha Patel',    type: 'Gait Assessment', duration: '08:11', score: 87, time: '4h ago', status: 'complete' },
  { id: 3, athlete: 'Carlos Rivera',  type: 'Jump Mechanics',  duration: '15:02', score: 91, time: '6h ago', status: 'complete' },
  { id: 4, athlete: 'Emma Chen',      type: 'Agility Test',    duration: '06:45', score: 78, time: '1d ago', status: 'complete' },
  { id: 5, athlete: 'Jordan Blake',   type: 'Sprint Analysis', duration: '09:50', score: 88, time: '1d ago', status: 'complete' },
]

const quickActions = [
  {
    id: 'capture',
    title: 'Start Capture',
    desc: 'Launch 3-camera motion capture session',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 10l4.553-2.07A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.89L15 14"/>
        <rect x="3" y="8" width="12" height="8" rx="2"/>
      </svg>
    ),
    color: 'red' as const,
    badge: 'CAMERAS READY',
  },
  {
    id: 'athletes',
    title: 'Athletes',
    desc: 'Manage profiles and track performance',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    color: 'cyan' as const,
    badge: '24 ACTIVE',
  },
  {
    id: 'reports',
    title: 'Reports',
    desc: 'View analytics and session summaries',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    color: 'gold' as const,
    badge: '3 NEW',
  },
]

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [uptimeSeconds, setUptimeSeconds] = useState(14400)

  useEffect(() => {
    const t = setInterval(() => setUptimeSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  return (
    <div className="dashboard">
      {/* Background spider web decoration */}
      <div className="dashboard-bg">
        <svg viewBox="0 0 800 600" className="dashboard-web-bg" preserveAspectRatio="xMidYMid slice">
          {[80,160,240,320,400].map((r,i) => (
            <circle key={i} cx="800" cy="0" r={r} fill="none" stroke="rgba(220,38,38,0.06)" strokeWidth="1"
              strokeDasharray="4 6" style={{ animation: `spin-slow ${20 + i*5}s linear infinite` }}/>
          ))}
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => {
            const rad = a * Math.PI / 180
            return <line key={i} x1="800" y1="0"
              x2={800 + Math.cos(rad)*500} y2={Math.sin(rad)*500}
              stroke="rgba(220,38,38,0.04)" strokeWidth="0.8"/>
          })}
        </svg>
      </div>

      {/* Hero */}
      <div className="dashboard-hero animate-fade-in">
        <div className="hero-badge">
          <span className="live-dot" />
          <span>NDURANCE Motion AI — Active</span>
        </div>
        <h1 className="hero-title">
          Motion <span className="gradient-text-red">Intelligence</span>
          <br />Redefined
        </h1>
        <p className="hero-subtitle">
          Real-time biomechanics analysis with 3-camera capture,<br/>
          AI-powered insights and cinematic visualization.
        </p>
        <div className="hero-actions">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigate('capture')}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/></svg>}
          >
            Start New Session
          </Button>
          <Button variant="ghost" size="lg" onClick={() => onNavigate('reports')}>
            View Reports
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4 animate-fade-in delay-2">
        <MetricCard label="Total Sessions"  value="1,247" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>} trend={12}  color="red"    animDelay={0}   />
        <MetricCard label="Active Athletes" value="24"    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/></svg>} trend={4}   color="cyan"   animDelay={80}  />
        <MetricCard label="AI Accuracy"     value="98.7" unit="%" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>} trend={0.3} color="green"  animDelay={160} />
        <MetricCard label="System Uptime"   value={formatUptime(uptimeSeconds)} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} color="gold" animDelay={240} />
      </div>

      {/* Quick Actions + Recent Sessions */}
      <div className="dashboard-lower">
        {/* Quick Actions */}
        <div className="quick-actions animate-fade-in delay-3">
          <h3 className="section-title">Quick Actions</h3>
          <div className="actions-grid">
            {quickActions.map((action) => (
              <GlassCard
                key={action.id}
                variant={action.color}
                onClick={() => onNavigate(action.id)}
                className="action-card"
              >
                <div className={`action-icon-wrap action-icon-wrap--${action.color}`}>
                  {action.icon}
                </div>
                <div className="action-content">
                  <div className="action-header">
                    <h4 className="action-title">{action.title}</h4>
                    <span className={`action-badge action-badge--${action.color}`}>{action.badge}</span>
                  </div>
                  <p className="action-desc">{action.desc}</p>
                </div>
                <svg className="action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="recent-sessions animate-fade-in delay-4">
          <div className="section-header">
            <h3 className="section-title">Recent Sessions</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('reports')}>View All</Button>
          </div>
          <GlassCard className="sessions-table-wrap">
            <table className="sessions-table">
              <thead>
                <tr>
                  <th>Athlete</th>
                  <th>Session Type</th>
                  <th>Duration</th>
                  <th>Score</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((s, i) => (
                  <tr key={s.id} style={{ animationDelay: `${i * 60}ms` }} className="session-row">
                    <td>
                      <div className="athlete-cell">
                        <div className="athlete-avatar">{s.athlete.charAt(0)}</div>
                        <span>{s.athlete}</span>
                      </div>
                    </td>
                    <td><span className="session-type">{s.type}</span></td>
                    <td><span className="mono">{s.duration}</span></td>
                    <td>
                      <span className={`score-chip ${s.score >= 90 ? 'score-high' : s.score >= 80 ? 'score-mid' : 'score-low'}`}>
                        {s.score}
                      </span>
                    </td>
                    <td><span className="time-ago">{s.time}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
