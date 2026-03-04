interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-[var(--radius-md)] ${className}`}
      role="status"
      aria-label="Carregando"
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-[var(--card)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-xs)]">
      <Skeleton className="h-72 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}
