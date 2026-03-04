'use client'

import { motion } from 'framer-motion'
import { Size } from '@/types'

interface SizeSelectorProps {
  sizes: Size[]
  selected: Size | null
  onSelect: (size: Size) => void
}

const sizeLabels: Record<Size, string> = {
  S: 'P',
  M: 'M',
  L: 'G',
  XL: 'GG',
  XXL: 'XGG',
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#2D3436]">Tamanho</h3>
        <button className="text-xs text-[#6C5CE7] hover:underline">
          Guia de tamanhos
        </button>
      </div>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <motion.button
            key={size}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(size)}
            className={`relative w-14 h-14 rounded-xl font-semibold text-sm transition-all ${
              selected === size
                ? 'bg-[#6C5CE7] text-white shadow-lg shadow-purple-500/25'
                : 'bg-[#F8F9FE] text-[#2D3436] hover:border-[#6C5CE7] border-2 border-transparent'
            }`}
          >
            <div>{size}</div>
            <div className="text-[10px] opacity-60">{sizeLabels[size]}</div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
