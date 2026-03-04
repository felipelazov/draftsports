import { Star } from 'lucide-react'

interface RatingProps {
  value: number
  count?: number
  size?: 'sm' | 'md'
}

export function Rating({ value, count, size = 'sm' }: RatingProps) {
  const starSize = size === 'sm' ? 14 : 18

  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${value} de 5 estrelas${count !== undefined ? `, ${count} avaliações` : ''}`}
    >
      <div className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            className={
              star <= Math.round(value)
                ? 'fill-[var(--rating-filled)] text-[var(--rating-filled)]'
                : 'fill-[var(--rating-empty)] text-[var(--rating-empty)]'
            }
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-[var(--text-secondary)] ml-1">({count})</span>
      )}
    </div>
  )
}
