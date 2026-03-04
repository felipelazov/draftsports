'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Pencil, Trash2, Star, ArrowUp, ArrowDown, ArrowUpDown, ImageOff } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Product, League, ProductType } from '@/types'

const leagues: League[] = ['NBA', 'NFL', 'MLB', 'NHL', 'FUTEBOL', 'RETRO']
const types: ProductType[] = ['titular', 'reserva', 'retro', 'especial']

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [leagueFilter, setLeagueFilter] = useState<string>('')
  const [teamFilter, setTeamFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [featuredFilter, setFeaturedFilter] = useState<string>('')
  const [stockFilter, setStockFilter] = useState<string>('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<string>('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const fetchProducts = () => {
    setLoading(true)
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(({ products }) => setProducts(products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Erro ao deletar:', err)
    }
    setDeleteId(null)
  }

  const toggleFeatured = async (product: Product) => {
    const newFeatured = !product.featured
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: newFeatured }),
      })
      if (res.ok) {
        setProducts(prev => prev.map(p =>
          p.id === product.id ? { ...p, featured: newFeatured } : p
        ))
      }
    } catch (err) {
      console.error('Erro ao atualizar destaque:', err)
    }
  }

  const teamsInProducts = [...new Set(products.map(p => p.team).filter(Boolean))].sort()

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ col }: { col: string }) => {
    if (sortKey !== col) return <ArrowUpDown size={14} className="text-[var(--gray-300)]" />
    return sortDir === 'asc'
      ? <ArrowUp size={14} className="text-[var(--primary)]" />
      : <ArrowDown size={14} className="text-[var(--primary)]" />
  }

  const filtered = products
    .filter(p => {
      const matchSearch = search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.team.toLowerCase().includes(search.toLowerCase()) ||
        (p.player && p.player.toLowerCase().includes(search.toLowerCase()))
      const matchLeague = leagueFilter === '' || p.league === leagueFilter
      const matchTeam = teamFilter === '' || p.team === teamFilter
      const matchType = typeFilter === '' || p.type === typeFilter
      const matchFeatured = featuredFilter === '' ||
        (featuredFilter === 'sim' && p.featured) ||
        (featuredFilter === 'nao' && !p.featured)
      const matchStock = stockFilter === '' ||
        (stockFilter === 'baixo' && p.stock <= 5) ||
        (stockFilter === 'ok' && p.stock > 5 && p.stock <= 50) ||
        (stockFilter === 'alto' && p.stock > 50)
      return matchSearch && matchLeague && matchTeam && matchType && matchFeatured && matchStock
    })
    .sort((a, b) => {
      if (!sortKey) return 0
      const dir = sortDir === 'asc' ? 1 : -1
      switch (sortKey) {
        case 'name': return a.name.localeCompare(b.name) * dir
        case 'league': return a.league.localeCompare(b.league) * dir
        case 'team': return a.team.localeCompare(b.team) * dir
        case 'type': return a.type.localeCompare(b.type) * dir
        case 'price': return (a.price - b.price) * dir
        case 'stock': return (a.stock - b.stock) * dir
        default: return 0
      }
    })

  const hasFilters = search || leagueFilter || teamFilter || typeFilter || featuredFilter || stockFilter

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)]">Produtos</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            {filtered.length} de {products.length} produtos
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-white rounded-[var(--radius-md)] text-sm font-semibold hover:shadow-[var(--shadow-glow)] transition-shadow"
        >
          <Plus size={18} />
          Novo Produto
        </Link>
      </div>

      {/* Filters - all side by side */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar nome, time ou jogador..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--card)] rounded-[var(--radius-md)] border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
          />
        </div>
        <select
          value={leagueFilter}
          onChange={e => { setLeagueFilter(e.target.value); setTeamFilter('') }}
          className="px-4 py-2.5 bg-[var(--card)] rounded-[var(--radius-md)] border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] cursor-pointer"
        >
          <option value="">Todas as ligas</option>
          {leagues.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={teamFilter}
          onChange={e => setTeamFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--card)] rounded-[var(--radius-md)] border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] cursor-pointer"
        >
          <option value="">Todos os times</option>
          {teamsInProducts
            .filter(t => !leagueFilter || products.some(p => p.team === t && p.league === leagueFilter))
            .map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--card)] rounded-[var(--radius-md)] border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] cursor-pointer"
        >
          <option value="">Todos os tipos</option>
          {types.map(t => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
        <select
          value={featuredFilter}
          onChange={e => setFeaturedFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--card)] rounded-[var(--radius-md)] border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] cursor-pointer"
        >
          <option value="">Destaque</option>
          <option value="sim">Destaque</option>
          <option value="nao">Normal</option>
        </select>
        <select
          value={stockFilter}
          onChange={e => setStockFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--card)] rounded-[var(--radius-md)] border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] cursor-pointer"
        >
          <option value="">Estoque</option>
          <option value="baixo">Baixo (0-5)</option>
          <option value="ok">Normal (6-50)</option>
          <option value="alto">Alto (50+)</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => {
              setSearch(''); setLeagueFilter(''); setTeamFilter('')
              setTypeFilter(''); setFeaturedFilter(''); setStockFilter('')
            }}
            className="px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--card)] rounded-[var(--radius-md)] border border-[var(--gray-200)] transition-colors cursor-pointer"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg animate-shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-muted)]">
            Nenhum produto encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--gray-100)]">
                  <th className="text-left px-6 py-4">
                    <button onClick={() => toggleSort('name')} className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer">
                      Nome <SortIcon col="name" />
                    </button>
                  </th>
                  <th className="text-left px-6 py-4">
                    <button onClick={() => toggleSort('league')} className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer">
                      Liga <SortIcon col="league" />
                    </button>
                  </th>
                  <th className="text-left px-6 py-4">
                    <button onClick={() => toggleSort('team')} className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer">
                      Time <SortIcon col="team" />
                    </button>
                  </th>
                  <th className="text-left px-6 py-4">
                    <button onClick={() => toggleSort('type')} className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer">
                      Tipo <SortIcon col="type" />
                    </button>
                  </th>
                  <th className="text-right px-6 py-4">
                    <button onClick={() => toggleSort('price')} className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer ml-auto">
                      Preço <SortIcon col="price" />
                    </button>
                  </th>
                  <th className="text-center px-6 py-4">
                    <button onClick={() => toggleSort('stock')} className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer mx-auto">
                      Estoque <SortIcon col="stock" />
                    </button>
                  </th>
                  <th className="text-center px-6 py-4 font-semibold text-[var(--text-secondary)]">Destaque</th>
                  <th className="text-right px-6 py-4 font-semibold text-[var(--text-secondary)]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id} className="border-b border-[var(--gray-50)] hover:bg-[var(--gray-50)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[var(--gray-100)] flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[var(--bg)] border border-[var(--gray-100)] flex items-center justify-center flex-shrink-0">
                            <ImageOff size={16} className="text-[var(--text-muted)]" />
                          </div>
                        )}
                        <span className="font-medium text-[var(--text)]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-[var(--bg)] rounded-full text-xs font-medium text-[var(--text-secondary)]">
                        {product.league}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">{product.team}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-[var(--text-secondary)] capitalize">{product.type}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-[var(--text)]">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-medium ${product.stock <= 5 ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleFeatured(product)}
                        className="cursor-pointer p-1 rounded-md hover:bg-[var(--bg)] transition-colors"
                        title={product.featured ? 'Remover destaque' : 'Marcar como destaque'}
                      >
                        <Star
                          size={18}
                          className={product.featured ? 'text-[var(--warning)]' : 'text-[var(--gray-300)]'}
                          fill={product.featured ? 'var(--warning)' : 'none'}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg)] rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/40">
          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 max-w-sm w-full mx-4 shadow-[var(--shadow-xl)]">
            <h3 className="text-lg font-bold text-[var(--text)] mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg)] rounded-[var(--radius-md)] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent)] hover:bg-red-600 rounded-[var(--radius-md)] transition-colors cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
