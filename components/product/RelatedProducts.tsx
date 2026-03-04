'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '@/types'
import { ProductCard } from '@/components/catalog/ProductCard'

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth',
    })
  }

  if (products.length === 0) return null

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#2D3436]">
          Você também pode gostar
        </h2>
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-9 h-9 rounded-full bg-[#F8F9FE] hover:bg-[#6C5CE7] hover:text-white flex items-center justify-center transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-9 h-9 rounded-full bg-[#F8F9FE] hover:bg-[#6C5CE7] hover:text-white flex items-center justify-center transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[260px] max-w-[280px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
