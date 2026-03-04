interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'sale' | 'new' | 'hot'
  className?: string
}

const variants = {
  default: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  sale: 'bg-[var(--accent)]/10 text-[var(--accent)]',
  new: 'bg-[var(--success)]/10 text-[var(--success)]',
  hot: 'bg-[var(--warning)]/15 text-amber-700',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      role="status"
      className={`inline-flex items-center px-2.5 py-1 rounded-[var(--radius-full)] text-xs font-bold uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
