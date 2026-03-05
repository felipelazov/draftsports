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
    <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <CardPayment
        initialization={{ amount }}
        onSubmit={async (formData) => {
          await onSubmit(formData as unknown as Record<string, unknown>)
        }}
        customization={{
          visual: {
            style: {
              theme: 'custom',
              customVariables: {
                textPrimaryColor: '#2D3436',
                textSecondaryColor: '#636E72',
                inputBackgroundColor: '#F8F9FE',
                formBackgroundColor: '#FFFFFF',
                baseColor: '#6C5CE7',
                baseColorFirstVariant: '#5A4BD1',
                baseColorSecondVariant: '#A29BFE',
                errorColor: '#FF6B6B',
                successColor: '#00B894',
                outlinePrimaryColor: '#6C5CE7',
                outlineSecondaryColor: '#E0E0E0',
                buttonTextColor: '#FFFFFF',
                fontSizeExtraSmall: '11px',
                fontSizeSmall: '13px',
                fontSizeMedium: '14px',
                fontSizeLarge: '16px',
                fontSizeExtraLarge: '20px',
                fontWeightNormal: '400',
                fontWeightSemiBold: '600',
                inputVerticalPadding: '12px',
                inputHorizontalPadding: '16px',
                inputBorderWidth: '1px',
                inputFocusedBorderWidth: '2px',
                borderRadiusSmall: '8px',
                borderRadiusMedium: '12px',
                borderRadiusLarge: '16px',
                formPadding: '0px',
              },
            },
          },
        }}
      />
    </div>
  )
}
