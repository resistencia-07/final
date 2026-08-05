import type { ReactNode, MouseEvent } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'danger' | 'success' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  iconRight?: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

export default function Button({
  children, variant = 'primary', size = 'md', icon, iconRight,
  onClick, disabled, className = '', type = 'button', fullWidth
}: ButtonProps) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {icon && <span className="btn-icon">{icon}</span>}
      <span>{children}</span>
      {iconRight && <span className="btn-icon">{iconRight}</span>}
    </button>
  )
}
