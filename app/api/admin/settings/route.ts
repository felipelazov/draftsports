import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Erro ao buscar configuracoes' }, { status: 500 })
  }
}
