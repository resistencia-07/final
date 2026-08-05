import type { ReactNode, CSSProperties } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  variant?: 'default' | 'strong' | 'bordered' | 'red' | 'cyan' | 'gold' | 'green'
  onClick?: () => void
  animDelay?: number
}

export default function GlassCard({
  children, className = '', style, variant = 'default', onClick, animDelay
}: GlassCardProps) {
  return (
    <div
      className={`glass-card glass-card--${variant} ${onClick ? 'glass-card--clickable' : ''} ${className}`}
      style={{ ...(animDelay !== undefined ? { animationDelay: `${animDelay}ms` } : {}), ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
