'use client'

import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react'

// Init no nivel do modulo — este arquivo so carrega no client (ssr:false)
initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, { locale: 'pt-BR' })

interface CardPaymentWrapperProps {
  amount: number
  onSubmit: (formData: Record<string, unknown>) => Promise<void>
}

export default function CardPaymentWrapper({ amount, onSubmit }: CardPaymentWrapperProps) {
  return (
    <CardPayment
      initialization={{ amount }}
      onSubmit={async (formData) => {
        await onSubmit(formData as unknown as Record<string, unknown>)
      }}
    />
  )
}
