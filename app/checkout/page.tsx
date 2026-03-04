'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, Check, Lock, User, MapPin, CreditCard, Loader2, Copy, QrCode, Clock } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { ShippingAddress } from '@/types'
import { Button } from '@/components/ui/Button'
import { JerseyPlaceholder } from '@/components/ui/JerseyPlaceholder'
import { AddressForm } from '@/components/checkout/AddressForm'
import { PaymentForm } from '@/components/checkout/PaymentForm'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import { initMercadoPago } from '@mercadopago/sdk-react'

interface PixData {
  qrCode: string
  qrCodeBase64: string
  expirationDate: string
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState<'info' | 'pix-waiting' | 'success'>('info')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'cartao' | 'pix'>('cartao')
  const [address, setAddress] = useState<Partial<ShippingAddress>>({})
  const [personalInfo, setPersonalInfo] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [copied, setCopied] = useState(false)
  const [mpReady, setMpReady] = useState(false)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Inicializar Mercado Pago SDK no client-side
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
    if (publicKey) {
      initMercadoPago(publicKey, { locale: 'pt-BR' })
      setMpReady(true)
    }
  }, [])

  const subtotal = total()
  const pixDiscount = paymentMethod === 'pix' ? subtotal * 0.05 : 0
  const shipping = subtotal >= 299 ? 0 : 29.90
  const grandTotal = subtotal - pixDiscount + shipping

  // Polling PIX status
  const startPixPolling = useCallback((oid: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current)

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkout/pix-status/${oid}`)
        const data = await res.json()
        if (data.status === 'pago') {
          if (pollingRef.current) clearInterval(pollingRef.current)
          setStep('success')
          clearCart()
        }
      } catch {
        // Silently continue polling
      }
    }, 5000)
  }, [clearCart])

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  const validateForm = () => {
    if (!personalInfo.name.trim()) {
      setError('Preencha seu nome completo.')
      return false
    }
    if (!personalInfo.email.trim() || !/\S+@\S+\.\S+/.test(personalInfo.email)) {
      setError('Preencha um email valido.')
      return false
    }
    const cleanZip = (address.zip || '').replace(/\D/g, '')
    if (cleanZip.length !== 8) {
      setError('Preencha um CEP valido (8 digitos).')
      return false
    }
    if (!address.street?.trim() || !address.number?.trim() || !address.city?.trim() || !address.state?.trim()) {
      setError('Preencha todos os campos do endereco (rua, numero, cidade, estado).')
      return false
    }
    return true
  }

  const getShippingAddress = () => ({
    name: personalInfo.name,
    street: address.street || '',
    number: address.number || '',
    complement: address.complement || '',
    neighborhood: address.neighborhood || '',
    city: address.city || '',
    state: address.state || '',
    zip: address.zip || '',
  })

  const getOrderItems = () =>
    items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      size: item.size,
      price: item.product.price,
    }))

  // Cartao: chamado pelo CardPayment Brick via onSubmit
  const handleCardSubmit = async (formData: { token: string; installments: number; payer: { email?: string } }) => {
    setError(null)
    if (!validateForm()) return

    setLoading(true)
    try {
      const supabase = createSupabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login?redirect=/checkout')
        return
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: getOrderItems(),
          paymentMethod: 'cartao',
          shippingAddress: getShippingAddress(),
          total: grandTotal,
          token: formData.token,
          installments: formData.installments,
          payerEmail: formData.payer.email || personalInfo.email,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Erro ao processar pagamento')
      }

      setOrderId(data.orderId)
      setStep('success')
      clearCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento')
    } finally {
      setLoading(false)
    }
  }

  // PIX: chamado pelo botao "Confirmar Pedido"
  const handlePixSubmit = async () => {
    setError(null)
    if (!validateForm()) return

    setLoading(true)
    try {
      const supabase = createSupabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login?redirect=/checkout')
        return
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: getOrderItems(),
          paymentMethod: 'pix',
          shippingAddress: getShippingAddress(),
          total: grandTotal,
          payerEmail: personalInfo.email,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Erro ao gerar PIX')
      }

      setOrderId(data.orderId)
      setPixData(data.pix)
      setStep('pix-waiting')
      clearCart()
      startPixPolling(data.orderId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar PIX')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyPix = async () => {
    if (pixData?.qrCode) {
      await navigator.clipboard.writeText(pixData.qrCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (items.length === 0 && step === 'info') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#2D3436] mb-2">
            Carrinho vazio
          </h1>
          <Link href="/catalogo">
            <Button>Ir ao Catalogo</Button>
          </Link>
        </div>
      </div>
    )
  }

  // --- Tela PIX Waiting ---
  if (step === 'pix-waiting' && pixData) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-[#6C5CE7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode size={32} className="text-[#6C5CE7]" />
          </div>
          <h1 className="text-2xl font-black text-[#2D3436] mb-2">
            Pague com PIX
          </h1>
          <p className="text-sm text-[#636E72] mb-6">
            Escaneie o QR Code ou copie o codigo para pagar
          </p>

          {/* QR Code */}
          {pixData.qrCodeBase64 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 inline-block">
              <img
                src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                alt="QR Code PIX"
                className="w-48 h-48 mx-auto"
              />
            </div>
          )}

          {/* Copia e Cola */}
          {pixData.qrCode && (
            <div className="bg-[#F8F9FE] rounded-xl p-4 mb-4">
              <p className="text-xs text-[#636E72] mb-2">Codigo PIX (copia e cola)</p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={pixData.qrCode}
                  className="flex-1 text-xs bg-white rounded-lg px-3 py-2 border border-gray-200 truncate"
                />
                <button
                  onClick={handleCopyPix}
                  className="flex items-center gap-1 px-4 py-2 bg-[#6C5CE7] text-white text-xs font-semibold rounded-lg hover:bg-[#5A4BD1] transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-center gap-2 text-sm text-[#636E72] mb-6">
            <Loader2 size={16} className="animate-spin text-[#6C5CE7]" />
            <span>Aguardando pagamento...</span>
          </div>

          {/* Timer info */}
          <div className="flex items-center justify-center gap-1 text-xs text-[#636E72]">
            <Clock size={12} />
            <span>O PIX expira em 30 minutos</span>
          </div>

          {orderId && (
            <p className="text-xs text-[#636E72] mt-4">
              Pedido #{orderId.substring(0, 8).toUpperCase()}
            </p>
          )}
        </motion.div>
      </div>
    )
  }

  // --- Tela Sucesso ---
  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 bg-[#00B894] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check size={40} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-[#2D3436] mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-[#636E72] mb-2">
            Seu pedido foi realizado com sucesso
          </p>
          {orderId && (
            <p className="text-sm text-[#636E72] mb-8">
              Pedido #{orderId.substring(0, 8).toUpperCase()}
            </p>
          )}

          <div className="bg-[#F8F9FE] rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-bold text-[#2D3436] mb-3">Resumo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#636E72]">Pagamento</span>
                <span className="text-[#2D3436] font-medium">
                  {paymentMethod === 'pix' ? 'PIX' : 'Cartao de Credito'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#636E72]">Total</span>
                <span className="text-[#6C5CE7] font-bold">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/catalogo" className="flex-1">
              <Button variant="outline" className="w-full">
                Continuar Comprando
              </Button>
            </Link>
            <Link href="/conta/pedidos" className="flex-1">
              <Button className="w-full">
                Meus Pedidos
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // --- Tela Principal de Checkout ---
  const inputClass =
    'w-full px-4 py-3 bg-[#F8F9FE] rounded-xl border border-gray-200 text-sm text-[#2D3436] outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all'

  return (
    <div className="pt-20 lg:pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link
          href="/carrinho"
          className="inline-flex items-center gap-2 text-sm text-[#636E72] hover:text-[#6C5CE7] mb-6"
        >
          <ArrowLeft size={16} />
          Voltar ao Carrinho
        </Link>

        <h1 className="text-3xl font-black text-[#2D3436] mb-6">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center mb-8 max-w-md">
          <div className="flex flex-col items-center">
            <div className="step-dot active">
              <User size={14} />
            </div>
            <span className="text-[10px] font-semibold text-[var(--primary)] mt-1.5">Dados</span>
          </div>
          <div className="step-line active flex-1 mx-2" />
          <div className="flex flex-col items-center">
            <div className="step-dot active">
              <MapPin size={14} />
            </div>
            <span className="text-[10px] font-semibold text-[var(--primary)] mt-1.5">Endereco</span>
          </div>
          <div className="step-line active flex-1 mx-2" />
          <div className="flex flex-col items-center">
            <div className="step-dot active">
              <CreditCard size={14} />
            </div>
            <span className="text-[10px] font-semibold text-[var(--primary)] mt-1.5">Pagamento</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-[#2D3436] mb-4">
                Dados Pessoais
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#636E72] mb-1.5">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, name: e.target.value })
                    }
                    placeholder="Seu nome completo"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#636E72] mb-1.5">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, email: e.target.value })
                      }
                      placeholder="seu@email.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#636E72] mb-1.5">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, phone: e.target.value })
                      }
                      placeholder="(00) 00000-0000"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <AddressForm address={address} onChange={setAddress} />
            </motion.div>

            {/* Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <PaymentForm
                method={paymentMethod}
                onMethodChange={setPaymentMethod}
                amount={grandTotal}
                onCardSubmit={handleCardSubmit}
                loading={loading}
                mpReady={mpReady}
              />
            </motion.div>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm sticky top-24"
            >
              <h2 className="text-lg font-bold text-[#2D3436] mb-4">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-3"
                  >
                    <div className="w-12 h-12 bg-[#F8F9FE] rounded-lg flex items-center justify-center flex-shrink-0">
                      <JerseyPlaceholder size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2D3436] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-[#636E72]">
                        Tam: {item.size} | Qtd: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[#2D3436]">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#636E72]">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {pixDiscount > 0 && (
                  <div className="flex justify-between text-[#00B894]">
                    <span>Desconto PIX (5%)</span>
                    <span>-{formatPrice(pixDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#636E72]">Frete</span>
                  <span className={shipping === 0 ? 'text-[#00B894]' : ''}>
                    {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                  </span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-[#2D3436]">Total</span>
                  <span className="text-xl font-black text-[#2D3436]">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Botao so aparece para PIX — Cartao usa o botao do Brick */}
              {paymentMethod === 'pix' && (
                <Button
                  onClick={handlePixSubmit}
                  size="lg"
                  disabled={loading}
                  className="w-full mt-6 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Lock size={16} />
                  )}
                  {loading ? 'Gerando PIX...' : 'Confirmar Pedido com PIX'}
                </Button>
              )}

              {paymentMethod === 'cartao' && (
                <p className="text-xs text-center text-[#636E72] mt-6">
                  Preencha o cartao acima e clique em &quot;Pagar&quot; no formulario
                </p>
              )}

              <p className="text-[10px] text-center text-[#636E72] mt-3">
                <Lock size={10} className="inline mr-1" />
                Pagamento seguro com criptografia SSL
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
