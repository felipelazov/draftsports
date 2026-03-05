'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag } from 'lucide-react'
import { Product } from '@/types'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { JerseyPlaceholder } from '@/components/ui/JerseyPlaceholder'
import { Rating } from '@/components/ui/Rating'
import { useFavorites } from '@/hooks/useFavorites'
import { useCart } from '@/hooks/useCart'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addItem, openCart } = useCart()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -10, y: x * 10 })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-glow)] border border-transparent hover:border-[var(--primary-light)]/20"
    >
      {/* Shine effect */}
      <div
        className="absolute inset-0 z-10 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${(tilt.y / 10 + 0.5) * 100}% ${(tilt.x / -10 + 0.5) * 100}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
        }}
      />

      {/* Image */}
      <div className="relative h-56 sm:h-64 lg:h-72 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <JerseyPlaceholder size="xl" league={product.league} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {product.original_price && (
            <Badge variant="sale">
              -{calculateDiscount(product.price, product.original_price)}%
            </Badge>
          )}
          <Badge variant="default">{product.league}</Badge>
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite(product.id)
          }}
          aria-label={isFavorite(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all"
        >
          <motion.div
            whileTap={{ scale: 1.3 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Heart
              size={18}
              className={
                isFavorite(product.id)
                  ? 'fill-[#FF6B6B] text-[#FF6B6B]'
                  : 'text-gray-400 hover:text-[#FF6B6B]'
              }
            />
          </motion.div>
        </button>

        {/* Quick add overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addItem(product, product.sizes[0])
              openCart()
            }}
            aria-label={`Adicionar ${product.name} ao carrinho`}
            className="w-full py-2.5 bg-[#6C5CE7] rounded-xl text-sm font-semibold text-white hover:bg-[#5A4BD1] transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingBag size={16} />
            Adicionar ao Carrinho
          </button>
        </div>
      </div>

      {/* Info */}
      <Link href={`/produto/${product.slug}`}>
        <div className="p-4" style={{ transform: 'translateZ(20px)' }}>
          <p className="text-[11px] text-[var(--text-secondary)] font-semibold uppercase tracking-widest">
            {product.team}
          </p>
          <h3 className="font-bold text-[var(--text)] mt-1 truncate group-hover:text-[var(--primary)] transition-colors">
            {product.name}
          </h3>
          <div className="mt-1.5">
            <Rating value={product.rating} count={product.review_count} />
          </div>
          <div className="flex items-baseline gap-2 mt-2.5">
            <span className="text-lg font-black text-[var(--primary)]">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-sm text-[var(--text-muted)] line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#00B894] font-medium mt-0.5">
            ou 12x de {formatPrice(product.price / 12)}
          </p>
          <div className="flex gap-1 mt-2.5">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="text-[10px] px-2 py-0.5 bg-[var(--bg)] border border-[var(--border-light)] rounded-md text-[var(--text-secondary)] font-medium"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 text-[var(--text-muted)] font-medium">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
