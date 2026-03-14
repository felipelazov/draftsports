import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { createOrder } from '@/lib/supabase-admin'
import { payment } from '@/lib/mercadopago'
import { sendOrderConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Faca login para finalizar o pedido' }, { status: 401 })
    }

    const body = await request.json()
    const {
      items, paymentMethod, shippingAddress, total,
      token, installments, payment_method_id, issuer_id,
      payerEmail, payerIdentification,
    } = body

    if (!items?.length || !paymentMethod || !shippingAddress || !total) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // --- CARTAO: recebe token do CardPayment Brick ---
    if (paymentMethod === 'cartao') {
      if (!token) {
        return NextResponse.json({ error: 'Token do cartao nao fornecido' }, { status: 400 })
      }

      const mpPayment = await payment.create({
        body: {
          transaction_amount: Number(total),
          token,
          description: 'Draft Sports - Pedido',
          installments: installments || 1,
          payment_method_id: payment_method_id || undefined,
          issuer_id: issuer_id || undefined,
          payer: {
            email: payerEmail || user.email || '',
            ...(payerIdentification ? {
              identification: {
                type: payerIdentification.type || 'CPF',
                number: payerIdentification.number || '',
              },
            } : {}),
          },
        },
      })

      const status = mpPayment.status === 'approved' ? 'pago' : 'pendente'

      const order = await createOrder(
        {
          user_id: user.id,
          status,
          total,
          payment_method: paymentMethod,
          payment_id: String(mpPayment.id),
          shipping_address: shippingAddress,
        },
        items.map((item: { product_id: string; quantity: number; size: string; price: number }) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
        }))
      )

      // Enviar email de confirmacao (async, nao bloqueia resposta)
      sendOrderConfirmation({
        to: payerEmail || user.email || '',
        customerName: shippingAddress.name || 'Cliente',
        orderId: order.id,
        total,
        items: items.map((i: { name?: string; quantity: number; size: string; price: number }) => ({
          name: i.name || 'Produto',
          quantity: i.quantity,
          size: i.size,
          price: i.price,
        })),
        paymentMethod,
      }).catch(() => {})

      if (mpPayment.status === 'rejected') {
        return NextResponse.json({
          success: false,
          message: 'Pagamento recusado. Verifique os dados do cartao.',
          status: mpPayment.status,
          statusDetail: mpPayment.status_detail,
        }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentStatus: mpPayment.status,
        message: status === 'pago' ? 'Pagamento aprovado!' : 'Pagamento em analise',
      })
    }

    // --- PIX: cria payment e retorna QR Code ---
    if (paymentMethod === 'pix') {
      const mpPayment = await payment.create({
        body: {
          transaction_amount: Number(total),
          description: 'Draft Sports - Pedido via PIX',
          payment_method_id: 'pix',
          payer: {
            email: payerEmail || user.email || '',
          },
        },
      })

      const order = await createOrder(
        {
          user_id: user.id,
          status: 'pendente',
          total,
          payment_method: paymentMethod,
          payment_id: String(mpPayment.id),
          shipping_address: shippingAddress,
        },
        items.map((item: { product_id: string; quantity: number; size: string; price: number }) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
        }))
      )

      sendOrderConfirmation({
        to: payerEmail || user.email || '',
        customerName: shippingAddress.name || 'Cliente',
        orderId: order.id,
        total,
        items: items.map((i: { name?: string; quantity: number; size: string; price: number }) => ({
          name: i.name || 'Produto',
          quantity: i.quantity,
          size: i.size,
          price: i.price,
        })),
        paymentMethod,
      }).catch(() => {})

      const pixData = mpPayment.point_of_interaction?.transaction_data

      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentStatus: mpPayment.status,
        pix: {
          qrCode: pixData?.qr_code || '',
          qrCodeBase64: pixData?.qr_code_base64 || '',
          expirationDate: mpPayment.date_of_expiration || '',
        },
      })
    }

    return NextResponse.json({ error: 'Metodo de pagamento invalido' }, { status: 400 })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { success: false, message: 'Erro ao processar pedido' },
      { status: 500 }
    )
  }
}
