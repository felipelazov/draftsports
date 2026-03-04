import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { updateSetting } from '@/lib/supabase-admin'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const body = await request.json()
    const setting = await updateSetting(key, body)

    // Invalidar cache da homepage quando banners mudam
    if (key === 'hero_banner' || key === 'promo_banner') {
      revalidatePath('/')
    }

    return NextResponse.json({ setting })
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json({ error: 'Erro ao atualizar configuracao' }, { status: 500 })
  }
}
