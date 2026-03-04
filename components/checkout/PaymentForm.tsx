'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { CreditCard, QrCode } from 'lucide-react'

const CardPaymentWrapper = dynamic(
  () => import('./CardPaymentWrapper'),
  { ssr: false }
)

interface PaymentFormProps {
  method: 'cartao' | 'pix'
  onMethodChange: (method: 'cartao' | 'pix') => void
  amount: number
  onCardSubmit: (formData: Record<string, unknown>) => Promise<void>
  loading?: boolean
}

export function PaymentForm({ method, onMethodChange, amount, onCardSubmit, loading }: PaymentFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#2D3436]">Pagamento</h3>

      {/* Method selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onMethodChange('cartao')}
          disabled={loading}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
            method === 'cartao'
              ? 'border-[#6C5CE7] bg-[#6C5CE7]/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <CreditCard
            size={20}
            className={method === 'cartao' ? 'text-[#6C5CE7]' : 'text-[#636E72]'}
          />
          <div className="text-left">
            <p className={`text-sm font-semibold ${method === 'cartao' ? 'text-[#6C5CE7]' : 'text-[#2D3436]'}`}>
              Cartao
            </p>
            <p className="text-[10px] text-[#636E72]">Credito/Debito</p>
          </div>
        </button>

        <button
          onClick={() => onMethodChange('pix')}
          disabled={loading}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
            method === 'pix'
              ? 'border-[#6C5CE7] bg-[#6C5CE7]/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <QrCode
            size={20}
            className={method === 'pix' ? 'text-[#6C5CE7]' : 'text-[#636E72]'}
          />
          <div className="text-left">
            <p className={`text-sm font-semibold ${method === 'pix' ? 'text-[#6C5CE7]' : 'text-[#2D3436]'}`}>
              PIX
            </p>
            <p className="text-[10px] text-[#636E72]">Aprovacao instantanea</p>
          </div>
        </button>
      </div>

      {/* Card form — CardPayment Brick */}
      {method === 'cartao' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <CardPaymentWrapper amount={amount} onSubmit={onCardSubmit} />
        </motion.div>
      )}

      {/* PIX */}
      {method === 'pix' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-center py-6 overflow-hidden"
        >
          <div className="w-48 h-48 mx-auto bg-[#F8F9FE] rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
            <div className="text-center">
              <QrCode size={64} className="text-[#6C5CE7] mx-auto mb-2" />
              <p className="text-xs text-[#636E72]">QR Code PIX</p>
            </div>
          </div>
          <p className="text-sm text-[#636E72]">
            O QR Code sera gerado ao confirmar o pedido
          </p>
          <p className="text-xs text-[#00B894] font-medium mt-1">
            5% de desconto no PIX
          </p>
        </motion.div>
      )}
    </div>
  )
}
