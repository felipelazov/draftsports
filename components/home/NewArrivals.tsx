'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import { JerseyPlaceholder } from '@/components/ui/JerseyPlaceholder'
import { useFavorites } from '@/hooks/useFavorites'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import type { Product } from '@/types'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
}

export function NewArrivals() {
  const { sections } = useSiteSettings()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addItem, openCart } = useCart()
  const [newArrivals, setNewArrivals] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products?sort=newest&limit=8')
      .then((res) => res.json())
      .then((data) => setNewArrivals(data.products || []))
      .catch(() => {})
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-black text-[#2D3436]">
          {sections.new_arrivals_title}
        </h2>
        <p className="text-[#636E72] mt-3 text-lg">
          {sections.new_arrivals_subtitle}
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {newArrivals.map((product) => (
          <motion.div key={product.id} variants={item}>
            <div className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-[var(--shadow-glow)] border border-transparent hover:border-[var(--primary-light)]/20 transition-all duration-500">
              {/* Image */}
              <div className="relative h-56 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
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
                    <JerseyPlaceholder size="lg" league={product.league} />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <Badge variant="new">Novo</Badge>
                  {product.original_price && (
                    <Badge variant="sale">
                      -{calculateDiscount(product.price, product.original_price)}%
                    </Badge>
                  )}
                </div>

                {/* Favorite */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  aria-label={isFavorite(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all"
                >
                  <Heart
                    size={16}
                    className={
                      isFavorite(product.id)
                        ? 'fill-[#FF6B6B] text-[#FF6B6B]'
                        : 'text-gray-400'
                    }
                  />
                </button>

                {/* Quick add overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    onClick={() => {
                      addItem(product, product.sizes[0])
                      openCart()
                    }}
                    aria-label={`Adicionar ${product.name} ao carrinho`}
                    className="w-full py-2 bg-[#6C5CE7] rounded-xl text-sm font-semibold text-white hover:bg-[#5A4BD1] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} />
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Info */}
              <Link href={`/produto/${product.slug}`}>
                <div className="p-3 sm:p-4">
                  <p className="text-[10px] sm:text-xs text-[#636E72] font-medium uppercase tracking-wider">
                    {product.team}
                  </p>
                  <h3 className="font-bold text-sm sm:text-base text-[var(--text)] mt-1 truncate group-hover:text-[var(--primary)] transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-1">
                    <Rating value={product.rating} count={product.review_count} />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-base sm:text-lg font-bold text-[#6C5CE7]">
                      {formatPrice(product.price)}
                    </span>
                    {product.original_price && (
                      <span className="text-xs text-[#636E72] line-through">
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Link href="/catalogo">
          <Button variant="outline" size="lg" className="group">
            {sections.new_arrivals_cta}
            <ArrowRight
              size={18}
              className="inline ml-2 group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </Link>
      </motion.div>
    </section>
  )
}
