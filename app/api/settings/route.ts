import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const settings = await getSettings()
    const result: Record<string, unknown> = {}
    for (const s of settings) {
      result[s.setting_key] = s.setting_value
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Erro ao buscar configuracoes' }, { status: 500 })
  }
}
