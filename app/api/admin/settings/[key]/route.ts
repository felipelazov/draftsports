import { NextRequest, NextResponse } from 'next/server'
import { updateSetting } from '@/lib/supabase-admin'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const body = await request.json()
    const setting = await updateSetting(key, body)
    return NextResponse.json({ setting })
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json({ error: 'Erro ao atualizar configuracao' }, { status: 500 })
  }
}
