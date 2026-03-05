'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { FilterState, League, Size, ProductType } from '@/types'
import { Button } from '@/components/ui/Button'

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  isOpen: boolean
  onClose: () => void
}

const leagueOptions: { value: League; label: string }[] = [
  { value: 'NBA', label: 'NBA' },
  { value: 'NFL', label: 'NFL' },
  { value: 'MLB', label: 'MLB' },
  { value: 'NHL', label: 'NHL' },
  { value: 'FUTEBOL', label: 'Futebol' },
  { value: 'RETRO', label: 'Retro' },
]

const sizeOptions: Size[] = ['P', 'M', 'G', 'GG', 'XGG']

const typeOptions: { value: ProductType; label: string }[] = [
  { value: 'titular', label: 'Titular' },
  { value: 'reserva', label: 'Reserva' },
  { value: 'retro', label: 'Retro' },
  { value: 'especial', label: 'Especial' },
]

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sm font-semibold text-[#2D3436] mb-3"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FilterSidebar({ filters, onFilterChange, isOpen, onClose }: FilterSidebarProps) {
  const content = (
    <div className="space-y-0">
      {/* Liga */}
      <FilterSection title="Liga">
        <div className="space-y-1.5">
          {leagueOptions.map((league) => (
            <button
              key={league.value}
              onClick={() =>
                onFilterChange({
                  league: filters.league === league.value ? null : league.value,
                })
              }
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                filters.league === league.value
                  ? 'bg-[#6C5CE7] text-white font-medium'
                  : 'text-[#636E72] hover:bg-[#F8F9FE]'
              }`}
            >
              {league.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Preço */}
      <FilterSection title="Faixa de Preço">
        <div className="px-1">
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={filters.priceRange[1]}
            onChange={(e) =>
              onFilterChange({
                priceRange: [filters.priceRange[0], Number(e.target.value)],
              })
            }
            className="w-full accent-[#6C5CE7]"
          />
          <div className="flex justify-between text-xs text-[#636E72] mt-1">
            <span>R$ {filters.priceRange[0]}</span>
            <span>R$ {filters.priceRange[1]}</span>
          </div>
        </div>
      </FilterSection>

      {/* Tamanho */}
      <FilterSection title="Tamanho">
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => {
                const newSizes = filters.sizes.includes(size)
                  ? filters.sizes.filter((s) => s !== size)
                  : [...filters.sizes, size]
                onFilterChange({ sizes: newSizes })
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                filters.sizes.includes(size)
                  ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                  : 'border-gray-200 text-[#636E72] hover:border-[#6C5CE7]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Tipo */}
      <FilterSection title="Tipo">
        <div className="space-y-1.5">
          {typeOptions.map((type) => (
            <button
              key={type.value}
              onClick={() =>
                onFilterChange({
                  type: filters.type === type.value ? null : type.value,
                })
              }
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                filters.type === type.value
                  ? 'bg-[#6C5CE7] text-white font-medium'
                  : 'text-[#636E72] hover:bg-[#F8F9FE]'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Avaliação */}
      <FilterSection title="Avaliação Mínima">
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                onFilterChange({
                  rating: filters.rating === rating ? null : rating,
                })
              }
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                filters.rating === rating
                  ? 'bg-[#6C5CE7] text-white font-medium'
                  : 'text-[#636E72] hover:bg-[#F8F9FE]'
              }`}
            >
              {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
              <span className="text-xs">& acima</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Clear */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-[#FF6B6B] hover:text-[#FF6B6B]"
        onClick={() =>
          onFilterChange({
            league: null,
            team: null,
            priceRange: [0, 500],
            sizes: [],
            type: null,
            rating: null,
          })
        }
      >
        Limpar Filtros
      </Button>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal size={18} className="text-[#6C5CE7]" />
            <h3 className="font-bold text-[#2D3436]">Filtros</h3>
          </div>
          {content}
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-80 bg-white z-50 p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-[#6C5CE7]" />
                  <h3 className="font-bold text-[#2D3436]">Filtros</h3>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
