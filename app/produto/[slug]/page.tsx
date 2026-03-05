'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Truck, Shield, RotateCcw, Check, Minus, Plus, AlertCircle, Loader2, Bell } from 'lucide-react'
import { Size, Product } from '@/types'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { PriceTag } from '@/components/ui/PriceTag'
import { Button } from '@/components/ui/Button'
import { ProductGallery } from '@/components/product/ProductGallery'
import { SizeSelector } from '@/components/product/SizeSelector'
import { ReviewSection } from '@/components/product/ReviewSection'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { VirtualTryOn } from '@/components/product/VirtualTryOn'
import { useCart } from '@/hooks/useCart'
import { useFavorites } from '@/hooks/useFavorites'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifySubmitted, setNotifySubmitted] = useState(false)
  const { addItem, openCart } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    setLoading(true)
    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((data) => {
        setProduct(data.product)
        setRelatedProducts(data.related || [])
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <AlertCircle size={64} className="text-[var(--gray-300)] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Produto nao encontrado
          </h1>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) return
    addItem(product, selectedSize, quantity)
    setAddedToCart(true)
    setTimeout(() => {
      setAddedToCart(false)
      openCart()
    }, 1000)
  }

  const handleNotifyStock = () => {
    if (!notifyEmail || !product) return
    const stored = JSON.parse(localStorage.getItem('draft-stock-alerts') || '[]')
    stored.push({ productId: product.id, productName: product.name, email: notifyEmail, date: new Date().toISOString() })
    localStorage.setItem('draft-stock-alerts', JSON.stringify(stored))
    setNotifySubmitted(true)
  }

  return (
    <div className="pt-20 lg:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-[#636E72] mb-6"
        >
          <a href="/catalogo" className="hover:text-[#6C5CE7]">Catalogo</a>
          <span>/</span>
          <a href={`/catalogo/${product.league.toLowerCase()}`} className="hover:text-[#6C5CE7]">
            {product.league}
          </a>
          <span>/</span>
          <span className="text-[#2D3436] font-medium">{product.name}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductGallery
              images={product.images}
              productName={product.name}
              league={product.league}
            />
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Badges */}
            <div className="flex gap-2 mb-3">
              <Badge>{product.league}</Badge>
              {product.type === 'retro' && <Badge variant="hot">Retro</Badge>}
              {product.original_price && (
                <Badge variant="sale">
                  -{calculateDiscount(product.price, product.original_price)}%
                </Badge>
              )}
            </div>

            {/* Team */}
            <p className="text-sm text-[#636E72] font-medium uppercase tracking-wider">
              {product.team}
            </p>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2D3436] mt-1">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= Math.round(product.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-200'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-[#636E72]">
                {product.rating} ({product.review_count} avaliacoes)
              </span>
            </div>

            {/* Price */}
            <div className="mt-4">
              <PriceTag
                price={product.price}
                originalPrice={product.original_price}
                size="lg"
              />
              <p className="text-sm text-[#00B894] mt-1 font-medium">
                ou 3x de {formatPrice(product.price / 3)} sem juros
              </p>
            </div>

            {/* Description */}
            <p className="text-[#636E72] mt-5 leading-relaxed">
              {product.description}
            </p>

            {/* Divider */}
            <div className="section-divider my-6" />

            {/* Size Selector */}
            <SizeSelector
              sizes={product.sizes}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />

            {/* Virtual Try-On */}
            <VirtualTryOn product={product} />

            {product.stock === 0 ? (
              /* Out of Stock - Notify */
              <div className="mt-6 p-5 bg-[#FFF3E0] rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={18} className="text-orange-600" />
                  <span className="font-bold text-orange-800 text-sm">Produto esgotado</span>
                </div>
                {notifySubmitted ? (
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Check size={16} />
                    <span>Pronto! Voce sera avisado quando voltar ao estoque.</span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-orange-700 mb-3">
                      Deixe seu e-mail e avisaremos quando este produto voltar.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-orange-200 text-sm focus:outline-none focus:border-orange-400 bg-white"
                      />
                      <button
                        onClick={handleNotifyStock}
                        disabled={!notifyEmail}
                        className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                      >
                        <Bell size={16} />
                        Avisar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* Quantity */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-[#2D3436] mb-3">
                    Quantidade
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#F8F9FE] rounded-xl">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:text-[#6C5CE7] transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:text-[#6C5CE7] transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-sm text-[#636E72]">
                      {product.stock} em estoque
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    size="lg"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <AnimatePresence mode="wait">
                      {addedToCart ? (
                        <motion.span
                          key="added"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Check size={20} /> Adicionado!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex items-center gap-2"
                        >
                          <ShoppingBag size={20} />
                          {selectedSize ? 'Adicionar ao Carrinho' : 'Selecione o Tamanho'}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    onClick={() => toggleFavorite(product.id)}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                      isFavorite(product.id)
                        ? 'bg-[#FF6B6B]/10 text-[#FF6B6B]'
                        : 'bg-[#F8F9FE] text-[#636E72] hover:text-[#FF6B6B]'
                    }`}
                  >
                    <Heart
                      size={22}
                      className={isFavorite(product.id) ? 'fill-current' : ''}
                    />
                  </motion.button>
                </div>
              </>
            )}

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              {[
                { icon: Truck, text: 'Frete Gratis', sub: 'Acima de R$ 299' },
                { icon: Shield, text: '100% Original', sub: 'Garantia total' },
                { icon: RotateCcw, text: 'Troca Facil', sub: 'Ate 30 dias' },
              ].map(({ icon: Icon, text, sub }) => (
                <div
                  key={text}
                  className="flex flex-col items-center gap-1.5 py-4 bg-[var(--bg)] rounded-xl text-center border border-[var(--border-light)] hover:border-[var(--primary-light)]/30 hover:shadow-[var(--shadow-sm)] transition-all"
                >
                  <div className="w-9 h-9 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                    <Icon size={16} className="text-[var(--primary)]" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--text)]">
                    {text}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    {sub}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <ReviewSection
          rating={product.rating}
          reviewCount={product.review_count}
        />

        {/* Related */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  )
}
