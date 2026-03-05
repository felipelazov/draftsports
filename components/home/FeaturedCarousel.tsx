'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from 'lucide-react'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import { JerseyPlaceholder } from '@/components/ui/JerseyPlaceholder'
import { useFavorites } from '@/hooks/useFavorites'
import { useCart } from '@/hooks/useCart'
import type { Product } from '@/types'

export function FeaturedCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addItem, openCart } = useCart()
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then((res) => res.json())
      .then((data) => setFeatured(data.products || []))
      .catch(() => {})
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 340
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-black text-[#2D3436]">
              Destaques da{' '}
              <span className="gradient-text">semana</span>
            </h2>
            <p className="text-[#636E72] mt-2">
              Os produtos mais populares escolhidos para você
            </p>
          </motion.div>

          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Anterior"
              className="w-10 h-10 rounded-full bg-[#F8F9FE] hover:bg-[#6C5CE7] hover:text-white flex items-center justify-center transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Próximo"
              className="w-10 h-10 rounded-full bg-[#F8F9FE] hover:bg-[#6C5CE7] hover:text-white flex items-center justify-center transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory -mx-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[300px] snap-center"
            >
              <div className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-[var(--shadow-glow)] border border-transparent hover:border-[var(--primary-light)]/20 transition-all duration-500">
                {/* Image area */}
                <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      sizes="300px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <JerseyPlaceholder size="xl" league={product.league} />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.original_price && (
                      <Badge variant="sale">
                        -{calculateDiscount(product.price, product.original_price)}%
                      </Badge>
                    )}
                    <Badge variant="default">{product.league}</Badge>
                  </div>

                  {/* Favorite button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(product.id)
                    }}
                    aria-label={isFavorite(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all"
                  >
                    <Heart
                      size={18}
                      className={
                        isFavorite(product.id)
                          ? 'fill-[#FF6B6B] text-[#FF6B6B]'
                          : 'text-gray-400'
                      }
                    />
                  </button>

                  {/* Quick add */}
                  <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      onClick={() => {
                        addItem(product, product.sizes[0])
                        openCart()
                      }}
                      className="w-full py-2.5 bg-white rounded-xl text-sm font-semibold text-[#2D3436] hover:bg-[#6C5CE7] hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={16} />
                      Adicionar ao Carrinho
                    </button>
                  </motion.div>
                </div>

                {/* Info */}
                <Link href={`/produto/${product.slug}`}>
                  <div className="p-4">
                    <p className="text-xs text-[#636E72] font-medium uppercase tracking-wider">
                      {product.team}
                    </p>
                    <h3 className="font-bold text-[#2D3436] mt-1 truncate">
                      {product.name}
                    </h3>
                    <Rating value={product.rating} count={product.review_count} />
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-[#6C5CE7]">
                        {formatPrice(product.price)}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-[#636E72] line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
