'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  Check,
  Truck,
  Package,
  Copy,
  ExternalLink,
  MapPin,
} from 'lucide-react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { JerseyPlaceholder } from '@/components/ui/JerseyPlaceholder'
import type { OrderStatus } from '@/types'

interface OrderDetail {
  id: string
  status: OrderStatus
  total: number
  payment_method: string
  tracking_code: string | null
  tracking_url: string | null
  shipping_address: {
    name: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zip: string
  }
  created_at: string
  updated_at: string
  order_items: {
    id: string
    quantity: number
    size: string
    price: number
    products: {
      id: string
      name: string
      images: string[]
    }
  }[]
}

const steps = [
  { key: 'pendente', label: 'Pendente', icon: Clock },
  { key: 'pago', label: 'Pago', icon: Check },
  { key: 'enviado', label: 'Enviado', icon: Truck },
  { key: 'entregue', label: 'Entregue', icon: Package },
] as const

function getStepIndex(status: OrderStatus) {
  return steps.findIndex((s) => s.key === status)
}

export default function PedidoDetalhePage() {
  const params = useParams()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!params.id) return
    fetch(`/api/orders/${params.id}`)
      .then((res) => res.json())
      .then((data) => setOrder(data.order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [params.id])

  const copyTracking = () => {
    if (order?.tracking_code) {
      navigator.clipboard.writeText(order.tracking_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="pt-20 lg:pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="h-8 w-48 animate-shimmer rounded" />
          <div className="h-64 animate-shimmer rounded-2xl" />
          <div className="h-40 animate-shimmer rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="pt-20 lg:pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center py-16">
          <h2 className="text-xl font-bold text-[#2D3436] mb-2">Pedido nao encontrado</h2>
          <Link href="/conta/pedidos" className="text-[#6C5CE7] hover:underline">
            Voltar aos pedidos
          </Link>
        </div>
      </div>
    )
  }

  const currentStep = getStepIndex(order.status)
  const addr = order.shipping_address

  return (
    <div className="pt-20 lg:pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href="/conta/pedidos"
          className="inline-flex items-center gap-2 text-sm text-[#636E72] hover:text-[#6C5CE7] mb-6"
        >
          <ArrowLeft size={16} />
          Meus Pedidos
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#2D3436]">
              Pedido #{order.id.substring(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm text-[#636E72]">
              {new Date(order.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-6"
        >
          <h3 className="text-lg font-bold text-[#2D3436] mb-6">Status do Pedido</h3>
          <div className="flex items-center justify-between relative">
            {/* Line behind steps */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-[var(--primary)] transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isCompleted = index <= currentStep
              const isCurrent = index === currentStep

              return (
                <div key={step.key} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? isCurrent
                          ? 'bg-[var(--primary)] text-white shadow-[0_0_0_4px_rgba(108,92,231,0.2)]'
                          : 'bg-[var(--success)] text-white'
                        : 'bg-gray-200 text-[#636E72]'
                    }`}
                  >
                    <StepIcon size={18} />
                  </div>
                  <span
                    className={`text-xs font-semibold mt-2 ${
                      isCompleted ? 'text-[#2D3436]' : 'text-[#B2BEC3]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Tracking Section */}
        {(order.status === 'enviado' || order.status === 'entregue') && order.tracking_code && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-6"
          >
            <h3 className="text-lg font-bold text-[#2D3436] mb-3 flex items-center gap-2">
              <Truck size={20} className="text-purple-600" />
              Rastreamento
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <code className="bg-white px-4 py-2 rounded-lg text-sm font-mono font-bold text-[#2D3436] flex-1">
                {order.tracking_code}
              </code>
              <button
                onClick={copyTracking}
                className="p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                title="Copiar codigo"
              >
                <Copy size={18} className={copied ? 'text-green-500' : 'text-[#636E72]'} />
              </button>
            </div>
            {order.tracking_url && (
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
              >
                <ExternalLink size={16} />
                Rastrear Encomenda
              </a>
            )}
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-6"
        >
          <h3 className="text-lg font-bold text-[#2D3436] mb-4">Itens do Pedido</h3>
          <div className="space-y-3">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-2">
                <div className="w-14 h-14 bg-[#F8F9FE] rounded-xl flex-shrink-0 relative overflow-hidden">
                  {item.products?.images?.[0] ? (
                    <Image src={item.products.images[0]} alt={item.products.name} fill className="object-contain p-1" sizes="56px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <JerseyPlaceholder size="sm" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#2D3436] truncate">
                    {item.products?.name || 'Produto'}
                  </p>
                  <p className="text-xs text-[#636E72]">
                    Tamanho: {item.size} | Quantidade: {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-[#2D3436]">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-[#2D3436] mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-[#636E72]" />
              Endereco de Entrega
            </h3>
            <div className="text-sm text-[#636E72] space-y-1">
              <p className="font-medium text-[#2D3436]">{addr.name}</p>
              <p>{addr.street}, {addr.number}{addr.complement ? ` - ${addr.complement}` : ''}</p>
              <p>{addr.neighborhood}</p>
              <p>{addr.city} - {addr.state}</p>
              <p>CEP: {addr.zip}</p>
            </div>
          </motion.div>

          {/* Payment Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-[#2D3436] mb-3">Resumo Financeiro</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#636E72]">Pagamento</span>
                <span className="font-medium text-[#2D3436]">
                  {order.payment_method === 'pix' ? 'PIX' : 'Cartao de Credito'}
                </span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between pt-1">
                <span className="font-bold text-[#2D3436]">Total</span>
                <span className="text-xl font-black text-[#6C5CE7]">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
