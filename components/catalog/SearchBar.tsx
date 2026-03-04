'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { JerseyPlaceholder } from '@/components/ui/JerseyPlaceholder'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (value.length >= 2) {
      fetch(`/api/products?search=${encodeURIComponent(value)}&limit=5`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data.products || []))
        .catch(() => setSuggestions([]))
    } else {
      setSuggestions([])
    }
  }, [value])

  return (
    <div className="relative w-full max-w-xl">
      <div
        className={`flex items-center bg-white rounded-xl border-2 transition-all ${
          focused ? 'border-[#6C5CE7] shadow-lg shadow-purple-500/10' : 'border-gray-200'
        }`}
      >
        <Search size={18} className="ml-4 text-[#636E72]" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Buscar por time, jogador ou produto..."
          className="flex-1 px-3 py-3 bg-transparent outline-none text-sm text-[#2D3436] placeholder-[#636E72]"
        />
        {value && (
          <button
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
            className="p-2 mr-1 hover:bg-gray-100 rounded-full"
          >
            <X size={16} className="text-[#636E72]" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {focused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30"
          >
            {suggestions.map((product) => (
              <Link
                key={product.id}
                href={`/produto/${product.slug}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F9FE] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <JerseyPlaceholder size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2D3436] truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-[#636E72]">{product.team}</p>
                </div>
                <span className="text-sm font-bold text-[#6C5CE7]">
                  {formatPrice(product.price)}
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
