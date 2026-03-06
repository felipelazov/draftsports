import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/supabase-admin'

const keyMap: Record<string, string> = {
  theme_colors: 'theme',
  site_links: 'links',
  store_info: 'store_info',
  hero_banner: 'hero_banner',
  homepage_sections: 'homepage_sections',
  homepage_features: 'homepage_features',
  newsletter: 'newsletter',
  product_config: 'product_config',
  checkout_config: 'checkout_config',
  footer_config: 'footer_config',
  page_sobre: 'page_sobre',
  page_privacidade: 'page_privacidade',
  page_termos: 'page_termos',
  page_trocas: 'page_trocas',
  page_faq: 'page_faq',
  page_tamanhos: 'page_tamanhos',
  page_contato: 'page_contato',
}

export async function GET() {
  try {
    const settings = await getSettings()
    const result: Record<string, unknown> = {}

    for (const s of settings) {
      const mapped = keyMap[s.setting_key]
      if (mapped) {
        result[mapped] = s.setting_value
      }
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({})
  }
}
