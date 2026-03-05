import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const settings = await getSettings()
    const result: Record<string, unknown> = {}

    for (const s of settings) {
      if (s.setting_key === 'theme_colors') result.theme = s.setting_value
      if (s.setting_key === 'site_links') result.links = s.setting_value
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({})
  }
}
