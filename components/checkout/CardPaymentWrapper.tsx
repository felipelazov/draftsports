'use client'

import { useEffect, useRef, useCallback } from 'react'
import { loadMercadoPago } from '@mercadopago/sdk-js'

interface CardPaymentWrapperProps {
  amount: number
  onSubmit: (formData: Record<string, unknown>) => Promise<void>
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function CardPaymentWrapper({ amount, onSubmit }: CardPaymentWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const brickRef = useRef<any>(null)
  const initializedRef = useRef(false)

  const onSubmitRef = useRef(onSubmit)
  onSubmitRef.current = onSubmit

  const initBrick = useCallback(async () => {
    if (initializedRef.current || !containerRef.current) return
    initializedRef.current = true

    try {
      const MercadoPago = await loadMercadoPago() as any
      if (!MercadoPago) return

      const mp = new MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, {
        locale: 'pt-BR',
      })

      const bricksBuilder = mp.bricks()

      brickRef.current = await bricksBuilder.create('cardPayment', 'mp-card-payment-container', {
        initialization: {
          amount,
        },
        callbacks: {
          onReady: () => {},
          onSubmit: async (formData: Record<string, unknown>) => {
            await onSubmitRef.current(formData)
          },
          onError: (error: unknown) => {
            console.error('CardPayment Brick error:', error)
          },
        },
        customization: {
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
        },
      })
    } catch (error) {
      console.error('Failed to init CardPayment Brick:', error)
      initializedRef.current = false
    }
  }, [amount])

  useEffect(() => {
    initBrick()

    return () => {
      if (brickRef.current?.unmount) {
        brickRef.current.unmount()
      }
      brickRef.current = null
      initializedRef.current = false
    }
  }, [initBrick])

  return (
    <div
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      <div id="mp-card-payment-container" ref={containerRef} />
    </div>
  )
}
