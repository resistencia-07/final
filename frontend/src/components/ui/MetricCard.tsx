import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  icon?: ReactNode
  trend?: number
  color?: 'red' | 'cyan' | 'gold' | 'green' | 'purple' | 'default'
  animDelay?: number
  size?: 'sm' | 'md' | 'lg'
}

export default function MetricCard({
  label, value, unit, icon, trend, color = 'default', animDelay = 0, size = 'md'
}: MetricCardProps) {
  const isPositiveTrend = trend !== undefined && trend >= 0

  return (
    <div
      className={`metric-card metric-card--${color} metric-card--${size} animate-fade-in`}
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        {icon && <span className={`metric-icon metric-icon--${color}`}>{icon}</span>}
      </div>
      <div className="metric-value-row">
        <span className="metric-value">{value}</span>
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className={`metric-trend ${isPositiveTrend ? 'positive' : 'negative'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            {isPositiveTrend
              ? <path d="M18 15l-6-6-6 6"/>
              : <path d="M6 9l6 6 6-6"/>}
          </svg>
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
      <div className={`metric-glow metric-glow--${color}`} />
    </div>
  )
}
