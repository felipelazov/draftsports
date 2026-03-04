'use client'

import { useEffect, useState } from 'react'
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react'

interface CardPaymentWrapperProps {
  amount: number
  onSubmit: (formData: Record<string, unknown>) => Promise<void>
}

export default function CardPaymentWrapper({ amount, onSubmit }: CardPaymentWrapperProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
    if (key) {
      initMercadoPago(key, { locale: 'pt-BR' })
      setReady(true)
    }
  }, [])

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C5CE7]" />
        <span className="ml-3 text-sm text-[#636E72]">Carregando formulario...</span>
      </div>
    )
  }

  return (
    <CardPayment
      initialization={{ amount }}
      onSubmit={async (formData) => {
        await onSubmit(formData as unknown as Record<string, unknown>)
      }}
    />
  )
}
