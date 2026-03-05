'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Clock,
  Check,
  Truck,
  Package,
  Loader2,
  Trash2,
  MapPin,
} from 'lucide-react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { JerseyPlaceholder } from '@/components/ui/JerseyPlaceholder'
import type { OrderStatus } from '@/types'

interface AdminOrderDetail {
  id: string
  user_id: string
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

const statusOptions: { value: OrderStatus; label: string; icon: typeof Clock }[] = [
  { value: 'pendente', label: 'Pendente', icon: Clock },
  { value: 'pago', label: 'Pago', icon: Check },
  { value: 'enviado', label: 'Enviado', icon: Truck },
  { value: 'entregue', label: 'Entregue', icon: Package },
]

export default function AdminPedidoDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<AdminOrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [status, setStatus] = useState<OrderStatus>('pendente')
  const [trackingCode, setTrackingCode] = useState('')
  const [trackingUrl, setTrackingUrl] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!params.id) return
    fetch(`/api/admin/orders/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        const o = data.order
        setOrder(o)
        setStatus(o.status)
        setTrackingCode(o.tracking_code || '')
        setTrackingUrl(o.tracking_url || '')
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [params.id])

  const handleSave = async () => {
    if (!order) return
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          tracking_code: trackingCode || null,
          tracking_url: trackingUrl || null,
        }),
      })

      if (!res.ok) throw new Error('Erro ao salvar')
      setMessage({ type: 'success', text: 'Pedido atualizado com sucesso!' })
    } catch {
      setMessage({ type: 'error', text: 'Erro ao atualizar pedido' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!order || !confirm('Tem certeza que deseja excluir este pedido?')) return
    setDeleting(true)

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir')
      router.push('/admin/pedidos')
    } catch {
      setMessage({ type: 'error', text: 'Erro ao excluir pedido' })
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-shimmer rounded" />
        <div className="h-64 animate-shimmer rounded-2xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-[#2D3436] mb-2">Pedido nao encontrado</h2>
        <Link href="/admin/pedidos" className="text-[#6C5CE7] hover:underline">
          Voltar aos pedidos
        </Link>
      </div>
    )
  }

  const addr = order.shipping_address
  const inputClass =
    'w-full px-4 py-2.5 bg-[#F8F9FE] rounded-xl border border-gray-200 text-sm text-[#2D3436] outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10'

  return (
    <div>
      <Link
        href="/admin/pedidos"
        className="inline-flex items-center gap-2 text-sm text-[#636E72] hover:text-[#6C5CE7] mb-6"
      >
        <ArrowLeft size={16} />
        Voltar aos Pedidos
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#2D3436]">
            Pedido #{order.id.substring(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-[#636E72]">
            Criado em {new Date(order.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
        >
          {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          Excluir
        </button>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-xl mb-6 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#2D3436] mb-4">Gerenciar Pedido</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#636E72] mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className={inputClass}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#636E72] mb-1.5">
                  Codigo de Rastreio
                </label>
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="Ex: BR123456789XX"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#636E72] mb-1.5">
                  URL de Rastreio
                </label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://rastreamento.correios.com.br/..."
                  className={inputClass}
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Salvando...' : 'Salvar Alteracoes'}
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#2D3436] mb-4">Itens do Pedido</h3>
            <div className="space-y-3">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-2">
                  <div className="w-12 h-12 bg-[#F8F9FE] rounded-xl flex-shrink-0 relative overflow-hidden">
                    {item.products?.images?.[0] ? (
                      <Image src={item.products.images[0]} alt={item.products.name} fill className="object-contain p-1" sizes="48px" />
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
                      Tam: {item.size} | Qtd: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-[#2D3436]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#2D3436] mb-3">Resumo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#636E72]">Pagamento</span>
                <span className="font-medium text-[#2D3436]">
                  {order.payment_method === 'pix' ? 'PIX' : 'Cartao'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#636E72]">Itens</span>
                <span className="font-medium text-[#2D3436]">
                  {order.order_items.reduce((s, i) => s + i.quantity, 0)}
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
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#2D3436] mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-[#636E72]" />
              Endereco
            </h3>
            <div className="text-sm text-[#636E72] space-y-1">
              <p className="font-medium text-[#2D3436]">{addr.name}</p>
              <p>{addr.street}, {addr.number}{addr.complement ? ` - ${addr.complement}` : ''}</p>
              <p>{addr.neighborhood}</p>
              <p>{addr.city} - {addr.state}</p>
              <p>CEP: {addr.zip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
