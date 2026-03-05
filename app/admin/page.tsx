'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, TrendingUp, Star, Plus, DollarSign, ShoppingBag, Users, AlertTriangle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Product, OrderStatus } from '@/types'

interface OrderSummary {
  id: string
  status: OrderStatus
  total: number
  payment_method: string
  created_at: string
  shipping_address: { name: string }
  order_items: { quantity: number; price: number; products: { name: string } }[]
}

interface Stats {
  totalProducts: number
  totalStock: number
  featuredCount: number
  avgPrice: number
  totalOrders: number
  totalRevenue: number
  paidOrders: number
  pendingOrders: number
  avgTicket: number
  lowStockProducts: Product[]
  recentOrders: OrderSummary[]
  topProducts: { name: string; sold: number; revenue: number }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/products').then(r => r.json()),
      fetch('/api/admin/orders').then(r => r.json()),
    ])
      .then(([productsData, ordersData]) => {
        const products: Product[] = productsData.products || []
        const orders: OrderSummary[] = ordersData.orders || []

        const paidOrders = orders.filter(o => o.status !== 'pendente')
        const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0)

        // Top products by quantity sold
        const productSales: Record<string, { name: string; sold: number; revenue: number }> = {}
        for (const order of paidOrders) {
          for (const item of order.order_items) {
            const name = item.products?.name || 'Produto'
            if (!productSales[name]) productSales[name] = { name, sold: 0, revenue: 0 }
            productSales[name].sold += item.quantity
            productSales[name].revenue += item.price * item.quantity
          }
        }
        const topProducts = Object.values(productSales)
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 5)

        setStats({
          totalProducts: products.length,
          totalStock: products.reduce((s, p) => s + p.stock, 0),
          featuredCount: products.filter(p => p.featured).length,
          avgPrice: products.length > 0 ? products.reduce((s, p) => s + p.price, 0) / products.length : 0,
          totalOrders: orders.length,
          totalRevenue,
          paidOrders: paidOrders.length,
          pendingOrders: orders.filter(o => o.status === 'pendente').length,
          avgTicket: paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0,
          lowStockProducts: products.filter(p => p.stock <= 5).sort((a, b) => a.stock - b.stock).slice(0, 5),
          recentOrders: orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5),
          topProducts,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusColors: Record<string, string> = {
    pendente: 'bg-yellow-100 text-yellow-700',
    pago: 'bg-blue-100 text-blue-700',
    enviado: 'bg-purple-100 text-purple-700',
    entregue: 'bg-green-100 text-green-700',
  }

  const cards = [
    { label: 'Faturamento', value: formatPrice(stats?.totalRevenue ?? 0), icon: DollarSign, color: '#00B894', bg: 'rgba(0, 184, 148, 0.1)' },
    { label: 'Pedidos', value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: '#6C5CE7', bg: 'rgba(108, 92, 231, 0.1)' },
    { label: 'Ticket Médio', value: formatPrice(stats?.avgTicket ?? 0), icon: TrendingUp, color: '#0984E3', bg: 'rgba(9, 132, 227, 0.1)' },
    { label: 'Produtos', value: stats?.totalProducts ?? 0, icon: Package, color: '#FDCB6E', bg: 'rgba(253, 203, 110, 0.1)' },
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]">
            {loading ? (
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl animate-shimmer" />
                <div className="w-20 h-4 rounded animate-shimmer" />
                <div className="w-16 h-8 rounded animate-shimmer" />
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">{label}</p>
                <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {!loading && stats && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-[var(--card)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[var(--text)]">Pedidos Recentes</h2>
              <Link href="/admin/pedidos" className="text-xs text-[#6C5CE7] font-semibold hover:underline">Ver todos</Link>
            </div>
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)] py-8 text-center">Nenhum pedido ainda</p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/pedidos/${order.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F9FE] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center">
                        <Users size={16} className="text-[#6C5CE7]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text)]">
                          {order.shipping_address?.name || 'Cliente'}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          #{order.id.substring(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${statusColors[order.status] || ''}`}>
                        {order.status.toUpperCase()}
                      </span>
                      <span className="text-sm font-bold text-[var(--text)]">{formatPrice(order.total)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Top Products + Low Stock */}
          <div className="space-y-6">
            {/* Top Products */}
            <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]">
              <h2 className="font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <Star size={16} className="text-yellow-500" />
                Mais Vendidos
              </h2>
              {stats.topProducts.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)] text-center py-4">Sem vendas ainda</p>
              ) : (
                <div className="space-y-3">
                  {stats.topProducts.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[var(--text-secondary)] w-5">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text)] truncate">{p.name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{p.sold} vendidos</p>
                      </div>
                      <span className="text-xs font-bold text-[#00B894]">{formatPrice(p.revenue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Low Stock Alert */}
            {stats.lowStockProducts.length > 0 && (
              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]">
                <h2 className="font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-orange-500" />
                  Estoque Baixo
                </h2>
                <div className="space-y-3">
                  {stats.lowStockProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/admin/produtos/${p.id}`}
                      className="flex items-center justify-between hover:bg-[#F8F9FE] p-2 rounded-lg transition-colors"
                    >
                      <p className="text-sm text-[var(--text)] truncate flex-1">{p.name}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {p.stock === 0 ? 'Esgotado' : `${p.stock} un.`}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]">
              <h2 className="font-bold text-[var(--text)] mb-4">Resumo</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Pedidos pagos</span>
                  <span className="font-medium text-[var(--text)]">{stats.paidOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Pedidos pendentes</span>
                  <span className="font-medium text-yellow-600">{stats.pendingOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Em destaque</span>
                  <span className="font-medium text-[var(--text)]">{stats.featuredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Estoque total</span>
                  <span className="font-medium text-[var(--text)]">{stats.totalStock} un.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Preço médio</span>
                  <span className="font-medium text-[var(--text)]">{formatPrice(stats.avgPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
