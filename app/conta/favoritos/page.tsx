'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Heart, Loader2 } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { ProductCard } from '@/components/catalog/ProductCard'
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types'

export default function FavoritosPage() {
  const { favorites } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const all: Product[] = data.products || []
        setProducts(all.filter((p) => favorites.includes(p.id)))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [favorites])

  return (
    <div className="pt-20 lg:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link
          href="/conta"
          className="inline-flex items-center gap-2 text-sm text-[#636E72] hover:text-[#6C5CE7] mb-6"
        >
          <ArrowLeft size={16} />
          Minha Conta
        </Link>

        <h1 className="text-3xl font-black text-[#2D3436] mb-8">
          Favoritos ({products.length})
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Heart size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#2D3436] mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-[#636E72] mb-6">
              Explore o catalogo e marque seus produtos favoritos
            </p>
            <Link href="/catalogo">
              <Button>Explorar Catalogo</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                layout
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
