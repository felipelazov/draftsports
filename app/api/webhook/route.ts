import { NextRequest, NextResponse } from 'next/server'
import { payment as mpPayment } from '@/lib/mercadopago'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendPaymentApproved } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Mercado Pago envia notificacoes com type e data.id
    if (body.type === 'payment' && body.data?.id) {
      const paymentInfo = await mpPayment.get({ id: body.data.id })

      if (!paymentInfo.id) {
        return NextResponse.json({ error: 'Payment nao encontrado' }, { status: 404 })
      }

      const newStatus = paymentInfo.status === 'approved' ? 'pago' : 'pendente'

      // Buscar order pelo payment_id
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('id, status')
        .eq('payment_id', String(paymentInfo.id))
        .single()

      if (order && order.status !== 'pago') {
        await supabaseAdmin
          .from('orders')
          .update({ status: newStatus })
          .eq('id', order.id)

        // Enviar email quando pagamento aprovado
        if (newStatus === 'pago') {
          const { data: fullOrder } = await supabaseAdmin
            .from('orders')
            .select('user_id, shipping_address')
            .eq('id', order.id)
            .single()

          if (fullOrder) {
            const { data: profile } = await supabaseAdmin.auth.admin.getUserById(fullOrder.user_id)
            const email = profile?.user?.email
            const name = (fullOrder.shipping_address as { name?: string })?.name || 'Cliente'
            if (email) {
              sendPaymentApproved(email, name, order.id).catch(() => {})
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
