import { useMemo } from 'react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import MetricCard from '../components/ui/MetricCard'
import { useAuth } from '../context/AuthContext'

interface ProfileProps {
  onNavigate: (page: string) => void
}

// Coaching/account stats below aren't part of the signup form and there's
// no backend yet, so they stay as placeholder studio data.
// TODO: Backend Integration Point — replace with real session/account analytics.
const studioData = {
  role: 'Performance Coach',
  team: 'NDURANCE Motion Lab',
  location: 'Location not set',
  account: {
    status: 'Premium',
    plan: 'NDURANCE Coach Pro',
    sessionsThisMonth: 18,
    lastActive: 'Just now',
  },
  performanceSummary: [
    { label: 'Avg Athlete Score', value: '91%', trend: 4 },
    { label: 'Session Completion', value: '98%', trend: 1.5 },
    { label: 'Retention', value: '89%', trend: -0.5 },
    { label: 'Average Feedback', value: '4.9 / 5', trend: 0.2 },
  ],
  goals: [
    'Add 5 new premium athlete seats',
    'Launch longitudinal mobility dashboard',
    'Deploy NDURANCE Vision v4.0 for jump analytics',
  ],
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'NC'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Profile({ onNavigate }: ProfileProps) {
  const { user, logout } = useAuth()

  const fullName = user?.fullName || 'Guest Coach'
  const initials = getInitials(fullName)

  const bmi = useMemo(() => {
    if (!user?.height || !user?.weight) return null
    const heightM = user.height / 100
    return +(user.weight / (heightM * heightM)).toFixed(1)
  }, [user?.height, user?.weight])

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return '—'
    return new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }, [user?.createdAt])

  const bodyMetrics = {
    Age: user?.age ?? '—',
    Height: user?.height ? `${user.height} cm` : '—',
    Weight: user?.weight ? `${user.weight} kg` : '—',
    BMI: bmi ?? '—',
    Gender: user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : '—',
  }

  const details = [
    { label: 'Username', value: user?.username || '—' },
    { label: 'Email', value: user?.email || '—' },
    { label: 'Role', value: studioData.role },
    { label: 'Team', value: studioData.team },
    { label: 'Location', value: studioData.location },
    { label: 'Member Since', value: memberSince },
  ]

  const metricCards = useMemo(() => studioData.performanceSummary.map((item, index) => ({
    ...item,
    color: item.trend >= 0 ? 'green' : 'red',
    animDelay: index * 80,
  })), [])

  return (
    <div className="profile-page">
      <div className="profile-hero animate-fade-in">
        <div className="profile-tag">Premium Coach Profile</div>
        <div className="profile-main-card glass-card-strong">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-main-details">
            <div className="profile-name">{fullName}</div>
            <div className="profile-meta">{studioData.role} · {studioData.team}</div>
            <div className="profile-chips">
              <span className="status-pill status-pill--premium">{studioData.account.status}</span>
              <span className="status-pill status-pill--plan">{studioData.account.plan}</span>
            </div>
          </div>
          <div className="profile-actions">
            <Button variant="primary" onClick={() => onNavigate('capture')}>Start New Session</Button>
            <Button variant="ghost" onClick={() => onNavigate('settings')}>Manage Studio</Button>
            <Button variant="danger" onClick={() => { logout(); onNavigate('login') }}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <section className="profile-section animate-fade-in delay-1">
          <h3>Account Overview</h3>
          <GlassCard className="profile-block" variant="bordered">
            <div className="profile-overview-row">
              <div>
                <span className="overview-label">Sessions this month</span>
                <strong>{studioData.account.sessionsThisMonth}</strong>
              </div>
              <div>
                <span className="overview-label">Last active</span>
                <strong>{studioData.account.lastActive}</strong>
              </div>
            </div>
            <div className="profile-progress-row">
              <div className="profile-progress-item">
                <span className="progress-label">Athlete retention</span>
                <div className="progress-bar"><div className="progress-fill" style={{ width: '89%' }} /></div>
                <span className="progress-value">89%</span>
              </div>
              <div className="profile-progress-item">
                <span className="progress-label">Premium seat usage</span>
                <div className="progress-bar"><div className="progress-fill" style={{ width: '72%' }} /></div>
                <span className="progress-value">72%</span>
              </div>
            </div>
          </GlassCard>
        </section>

        <section className="profile-section animate-fade-in delay-2">
          <h3>Body Metrics</h3>
          <GlassCard className="profile-block">
            <div className="metrics-grid">
              {Object.entries(bodyMetrics).map(([label, value]) => (
                <div key={label} className="metric-item">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        <section className="profile-section animate-fade-in delay-3">
          <h3>Performance Summary</h3>
          <div className="profile-summary-grid">
            {metricCards.map((item) => (
              <MetricCard
                key={item.label}
                label={item.label}
                value={item.value}
                unit={item.trend === 0 ? '' : undefined}
                trend={item.trend}
                color={item.color as 'green' | 'red'}
                animDelay={item.animDelay}
              />
            ))}
          </div>
        </section>

        <section className="profile-section animate-fade-in delay-4">
          <h3>Profile Details</h3>
          <GlassCard className="profile-block" variant="default">
            <div className="profile-details-grid">
              {details.map((item) => (
                <div key={item.label} className="detail-row">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        <section className="profile-section animate-fade-in delay-5">
          <h3>Current Goals</h3>
          <GlassCard className="profile-block" variant="cyan">
            <ul className="goals-list">
              {studioData.goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          </GlassCard>
        </section>
      </div>
    </div>
  )
}
