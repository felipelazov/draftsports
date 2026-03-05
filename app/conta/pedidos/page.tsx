'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Package, Truck, Check, Clock, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { JerseyPlaceholder } from '@/components/ui/JerseyPlaceholder'
import type { OrderStatus } from '@/types'

interface OrderListItem {
  id: string
  status: OrderStatus
  total: number
  created_at: string
  order_items: {
    id: string
    quantity: number
    size: string
    price: number
    products: {
      name: string
      images: string[]
    }
  }[]
}

const statusConfig = {
  pendente: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pendente' },
  pago: { icon: Check, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Pago' },
  enviado: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Enviado' },
  entregue: { icon: Package, color: 'text-green-600', bg: 'bg-green-100', label: 'Entregue' },
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="pt-20 lg:pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href="/conta"
          className="inline-flex items-center gap-2 text-sm text-[#636E72] hover:text-[#6C5CE7] mb-6"
        >
          <ArrowLeft size={16} />
          Minha Conta
        </Link>

        <h1 className="text-3xl font-black text-[#2D3436] mb-8">
          Meus Pedidos
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-shimmer h-40" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#2D3436] mb-2">Nenhum pedido encontrado</h2>
            <p className="text-[#636E72] mb-6">Voce ainda nao fez nenhum pedido.</p>
            <Link href="/catalogo">
              <button className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Ir ao Catalogo
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const status = statusConfig[order.status]
              const StatusIcon = status.icon

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/conta/pedidos/${order.id}`}>
                    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-bold text-[#2D3436]">
                            #{order.id.substring(0, 8).toUpperCase()}
                          </p>
                          <p className="text-xs text-[#636E72]">
                            {new Date(order.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
                          <StatusIcon size={14} />
                          {status.label}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#F8F9FE] rounded-lg flex-shrink-0 relative overflow-hidden">
                              {item.products?.images?.[0] ? (
                                <Image src={item.products.images[0]} alt={item.products.name} fill className="object-contain p-1" sizes="40px" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <JerseyPlaceholder size="sm" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#2D3436] truncate">
                                {item.products?.name || 'Produto'}
                              </p>
                              <p className="text-xs text-[#636E72]">
                                Tam: {item.size} | Qtd: {item.quantity}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-[#2D3436]">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-sm text-[#636E72]">Total</span>
                        <span className="text-lg font-bold text-[#6C5CE7]">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
