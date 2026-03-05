'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Clock, Check, Truck, Package, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { OrderStatus } from '@/types'

interface AdminOrder {
  id: string
  user_id: string
  status: OrderStatus
  total: number
  payment_method: string
  created_at: string
  order_items: {
    id: string
    quantity: number
    products: { name: string }
  }[]
}

const statusConfig = {
  pendente: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/15', label: 'Pendente' },
  pago: { icon: Check, color: 'text-blue-400', bg: 'bg-blue-500/15', label: 'Pago' },
  enviado: { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/15', label: 'Enviado' },
  entregue: { icon: Package, color: 'text-green-400', bg: 'bg-green-500/15', label: 'Entregue' },
}

const statusOptions: { value: string; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'pago', label: 'Pago' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregue', label: 'Entregue' },
]

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchOrders = () => {
    setLoading(true)
    const url = statusFilter ? `/api/admin/orders?status=${statusFilter}` : '/api/admin/orders'
    fetch(url)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const filteredOrders = orders.filter((order) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.user_id.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div>
      <h1 className="text-2xl font-black text-[var(--text)] mb-6">Pedidos</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID do pedido..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--card)] rounded-xl border border-[var(--gray-200)] text-sm outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--card)] rounded-xl border border-[var(--gray-200)] text-sm outline-none focus:border-[#6C5CE7] min-w-[140px]"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[var(--card)] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--gray-100)]">
                <th className="text-left px-6 py-4 font-semibold text-[var(--text-secondary)]">ID</th>
                <th className="text-left px-6 py-4 font-semibold text-[var(--text-secondary)]">Itens</th>
                <th className="text-left px-6 py-4 font-semibold text-[var(--text-secondary)]">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-[var(--text-secondary)]">Total</th>
                <th className="text-left px-6 py-4 font-semibold text-[var(--text-secondary)]">Data</th>
                <th className="text-left px-6 py-4 font-semibold text-[var(--text-secondary)]">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                    Carregando...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                    Nenhum pedido encontrado
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status = statusConfig[order.status]
                  const StatusIcon = status.icon
                  const itemCount = order.order_items.reduce((sum, i) => sum + i.quantity, 0)

                  return (
                    <tr key={order.id} className="border-b border-[var(--gray-50)] hover:bg-[var(--gray-50)]">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-[var(--text)]">
                          #{order.id.substring(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">
                        {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[var(--text)]">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/pedidos/${order.id}`}
                          className="inline-flex items-center gap-1.5 text-[#6C5CE7] hover:text-[#5A4BD1] font-medium"
                        >
                          <Eye size={16} />
                          Ver
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
