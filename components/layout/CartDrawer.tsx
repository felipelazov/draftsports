'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog"
            aria-label="Carrinho de compras"
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#6C5CE7]" />
                <h2 className="text-lg font-bold text-[#2D3436]">
                  Carrinho ({items.length})
                </h2>
              </div>
              <button
                onClick={closeCart}
                aria-label="Fechar carrinho"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-gray-300 mb-4" />
                  <p className="text-[#636E72] font-medium">
                    Seu carrinho está vazio
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Explore nosso catálogo e encontre sua camisa
                  </p>
                  <Link href="/catalogo" onClick={closeCart}>
                    <Button variant="primary" size="sm" className="mt-4">
                      Ver Catálogo
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 bg-[#F8F9FE] rounded-xl p-3"
                    >
                      <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary-light)]/20 flex items-center justify-center">
                            <ShoppingBag size={20} className="text-[var(--primary)]" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-[#2D3436] truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-[#636E72] mt-0.5">
                          Tamanho: {item.size}
                        </p>
                        <p className="font-bold text-[#6C5CE7] text-sm mt-1">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.quantity - 1
                                )
                              }
                              aria-label="Diminuir quantidade"
                              className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.quantity + 1
                                )
                              }
                              aria-label="Aumentar quantidade"
                              className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id, item.size)}
                            aria-label="Remover item"
                            className="p-1.5 text-gray-400 hover:text-[#FF6B6B] transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#636E72]">Total</span>
                  <span className="text-xl font-bold text-[#2D3436]">
                    {formatPrice(total())}
                  </span>
                </div>
                <Link href="/carrinho" onClick={closeCart} className="block">
                  <Button variant="outline" className="w-full">
                    Ver Carrinho
                  </Button>
                </Link>
                <Link href="/checkout" onClick={closeCart} className="block">
                  <Button variant="primary" className="w-full">
                    Finalizar Compra
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
