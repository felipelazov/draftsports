import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { getOrder } from '@/lib/supabase-admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 })
    }

    const order = await getOrder(orderId)

    if (order.user_id !== user.id) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 })
    }

    return NextResponse.json({
      status: order.status,
      paymentId: order.payment_id,
    })
  } catch (error) {
    console.error('Pix status error:', error)
    return NextResponse.json({ error: 'Erro ao consultar status' }, { status: 500 })
  }
}
