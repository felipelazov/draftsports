import { formatPrice, calculateDiscount } from '@/lib/utils'

interface PriceTagProps {
  price: number
  originalPrice?: number | null
  size?: 'sm' | 'md' | 'lg'
}

const textSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

export function PriceTag({ price, originalPrice, size = 'md' }: PriceTagProps) {
  const hasDiscount = originalPrice && originalPrice > price

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`font-bold text-[#2D3436] ${textSizes[size]}`}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-[#636E72] line-through">
            {formatPrice(originalPrice)}
          </span>
          <span className="text-xs font-bold text-[#FF6B6B] bg-[#FF6B6B]/10 px-2 py-0.5 rounded-full">
            -{calculateDiscount(price, originalPrice)}%
          </span>
        </>
      )}
    </div>
  )
}
