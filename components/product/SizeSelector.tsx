'use client'

import { motion } from 'framer-motion'
import { Size, StockPerSize } from '@/types'

interface SizeSelectorProps {
  sizes: Size[]
  selected: Size | null
  onSelect: (size: Size) => void
  stockPerSize?: StockPerSize
}

export function SizeSelector({ sizes, selected, onSelect, stockPerSize }: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#2D3436]">Tamanho</h3>
        <button className="text-xs text-[#6C5CE7] hover:underline">
          Guia de tamanhos
        </button>
      </div>
      <div className="flex gap-2">
        {sizes.map((size) => {
          const outOfStock = stockPerSize && stockPerSize[size] === 0
          return (
            <motion.button
              key={size}
              whileHover={outOfStock ? {} : { scale: 1.05 }}
              whileTap={outOfStock ? {} : { scale: 0.95 }}
              onClick={() => !outOfStock && onSelect(size)}
              disabled={outOfStock}
              className={`relative w-14 h-14 rounded-xl font-semibold text-sm transition-all ${
                outOfStock
                  ? 'bg-[#F0F0F0] text-[#B0B0B0] cursor-not-allowed line-through'
                  : selected === size
                    ? 'bg-[#6C5CE7] text-white shadow-lg shadow-purple-500/25'
                    : 'bg-[#F8F9FE] text-[#2D3436] hover:border-[#6C5CE7] border-2 border-transparent'
              }`}
            >
              {size}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
