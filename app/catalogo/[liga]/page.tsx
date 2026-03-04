'use client'

import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { SlidersHorizontal, Loader2 } from 'lucide-react'
import { FilterState, League, Product } from '@/types'
import { leagues } from '@/lib/mock-data'
import { FilterSidebar } from '@/components/catalog/FilterSidebar'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { SearchBar } from '@/components/catalog/SearchBar'

const sortOptions = [
  { value: 'popular', label: 'Mais Popular' },
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'price-asc', label: 'Menor Preco' },
  { value: 'price-desc', label: 'Maior Preco' },
] as const

export default function LigaCatalogoPage() {
  const params = useParams()
  const ligaSlug = (params.liga as string).toUpperCase() as League
  const leagueInfo = leagues.find((l) => l.id === ligaSlug)

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    league: ligaSlug,
    team: null,
    priceRange: [0, 500],
    sizes: [],
    type: null,
    rating: null,
    search: '',
    sort: 'popular',
  })

  useEffect(() => {
    fetch(`/api/products?league=${ligaSlug}`)
      .then((res) => res.json())
      .then((data) => setAllProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [ligaSlug])

  const handleFilterChange = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }))
  }

  const filteredProducts = useMemo(() => {
    let products = [...allProducts]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          (p.player && p.player.toLowerCase().includes(q))
      )
    }

    products = products.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    if (filters.sizes.length > 0) {
      products = products.filter((p) =>
        filters.sizes.some((s) => p.sizes.includes(s))
      )
    }

    if (filters.type) {
      products = products.filter((p) => p.type === filters.type)
    }

    if (filters.rating) {
      products = products.filter((p) => p.rating >= filters.rating!)
    }

    switch (filters.sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        products.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        products.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
      case 'popular':
        products.sort((a, b) => b.review_count - a.review_count)
        break
    }

    return products
  }, [filters, allProducts])

  return (
    <div className="pt-20 lg:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            {leagueInfo && (
              <span className="text-4xl">{leagueInfo.icon}</span>
            )}
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#2D3436]">
                {leagueInfo?.name || ligaSlug}
              </h1>
              <p className="text-[#636E72] mt-1">
                {loading ? 'Carregando...' : `${filteredProducts.length} produtos encontrados`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar
            value={filters.search}
            onChange={(search) => handleFilterChange({ search })}
          />
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium text-[#2D3436]"
            >
              <SlidersHorizontal size={16} />
              Filtros
            </button>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange({ sort: e.target.value as FilterState['sort'] })}
              className="px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm text-[#2D3436] outline-none focus:border-[#6C5CE7]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
          </div>
        ) : (
          <div className="flex gap-8">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              isOpen={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
            />
            <div className="flex-1">
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
