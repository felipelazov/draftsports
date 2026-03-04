'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { JerseyPlaceholder } from '@/components/ui/JerseyPlaceholder'

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, total } = useCart()
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const subtotal = total()
  const shipping = subtotal >= 299 ? 0 : 29.90
  const discount = couponApplied ? subtotal * 0.1 : 0
  const grandTotal = subtotal - discount + shipping

  const handleApplyCoupon = () => {
    if (coupon.toLowerCase() === 'draft10') {
      setCouponApplied(true)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#2D3436] mb-2">
            Seu carrinho está vazio
          </h1>
          <p className="text-[#636E72] mb-6">
            Explore nosso catálogo e encontre a camisa perfeita
          </p>
          <Link href="/catalogo">
            <Button>Explorar Catálogo</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-20 lg:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-sm text-[#636E72] hover:text-[#6C5CE7] mb-6"
          >
            <ArrowLeft size={16} />
            Continuar Comprando
          </Link>

          <h1 className="text-3xl font-black text-[#2D3436] mb-8">
            Carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100, height: 0 }}
                  className="bg-white rounded-2xl p-4 sm:p-6 flex gap-4 sm:gap-6 shadow-sm"
                >
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <JerseyPlaceholder size="md" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-[#636E72] uppercase tracking-wider">
                          {item.product.team}
                        </p>
                        <Link
                          href={`/produto/${item.product.slug}`}
                          className="font-bold text-[#2D3436] hover:text-[#6C5CE7] transition-colors block truncate"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-[#636E72] mt-1">
                          Tamanho: <span className="font-medium">{item.size}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="p-2 text-gray-400 hover:text-[#FF6B6B] transition-colors flex-shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-lg bg-[#F8F9FE] flex items-center justify-center hover:bg-[#6C5CE7] hover:text-white transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-semibold text-[#2D3436] w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-lg bg-[#F8F9FE] flex items-center justify-center hover:bg-[#6C5CE7] hover:text-white transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-lg font-bold text-[#6C5CE7]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm sticky top-24 border border-[var(--border-light)]"
            >
              <h2 className="text-lg font-bold text-[#2D3436] mb-6">
                Resumo do Pedido
              </h2>

              {/* Coupon */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center bg-[#F8F9FE] rounded-xl px-3">
                    <Tag size={16} className="text-[#636E72] mr-2" />
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Cupom de desconto"
                      className="flex-1 py-2.5 bg-transparent text-sm outline-none"
                      disabled={couponApplied}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !coupon}
                  >
                    {couponApplied ? '✓' : 'Aplicar'}
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-[#00B894] mt-1.5 font-medium">
                    Cupom DRAFT10 aplicado! -10%
                  </p>
                )}
                <p className="text-[10px] text-[#636E72] mt-1">
                  Teste com: DRAFT10
                </p>
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#636E72]">Subtotal</span>
                  <span className="text-[#2D3436]">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#00B894]">Desconto</span>
                    <span className="text-[#00B894]">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#636E72]">Frete</span>
                  <span className={shipping === 0 ? 'text-[#00B894] font-medium' : 'text-[#2D3436]'}>
                    {shipping === 0 ? 'Grátis' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-[#636E72]">
                    Frete grátis em compras acima de R$ 299
                  </p>
                )}
                <hr className="border-gray-100" />
                <div className="flex justify-between">
                  <span className="font-bold text-[#2D3436]">Total</span>
                  <span className="text-xl font-black text-[#2D3436]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
                <p className="text-xs text-[#636E72]">
                  ou 3x de {formatPrice(grandTotal / 3)} sem juros
                </p>
              </div>

              <Link href="/checkout" className="block mt-6">
                <Button size="lg" className="w-full">
                  Finalizar Compra
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
