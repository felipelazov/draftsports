'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, TrendingUp, Star, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface Stats {
  totalProducts: number
  totalStock: number
  featuredCount: number
  avgPrice: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(({ products }: { products: Product[] }) => {
        setStats({
          totalProducts: products.length,
          totalStock: products.reduce((sum, p) => sum + p.stock, 0),
          featuredCount: products.filter(p => p.featured).length,
          avgPrice: products.length > 0
            ? products.reduce((sum, p) => sum + p.price, 0) / products.length
            : 0,
        })
      })
      .catch(() => setStats({ totalProducts: 0, totalStock: 0, featuredCount: 0, avgPrice: 0 }))
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    {
      label: 'Total de Produtos',
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: 'var(--primary)',
      bg: 'rgba(108, 92, 231, 0.1)',
    },
    {
      label: 'Estoque Total',
      value: stats?.totalStock ?? 0,
      icon: TrendingUp,
      color: 'var(--success)',
      bg: 'rgba(0, 184, 148, 0.1)',
    },
    {
      label: 'Em Destaque',
      value: stats?.featuredCount ?? 0,
      icon: Star,
      color: 'var(--warning)',
      bg: 'rgba(253, 203, 110, 0.1)',
    },
    {
      label: 'Preço Médio',
      value: formatPrice(stats?.avgPrice ?? 0),
      icon: Package,
      color: 'var(--info)',
      bg: 'rgba(9, 132, 227, 0.1)',
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[var(--text)]">Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)]">Visão geral da loja</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-white rounded-[var(--radius-md)] text-sm font-semibold hover:shadow-[var(--shadow-glow)] transition-shadow"
        >
          <Plus size={18} />
          Novo Produto
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]"
          >
            {loading ? (
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl animate-shimmer" />
                <div className="w-20 h-4 rounded animate-shimmer" />
                <div className="w-16 h-8 rounded animate-shimmer" />
              </div>
            ) : (
              <>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: bg }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">{label}</p>
                <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
