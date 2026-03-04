import { HomeClient } from './home-client'
import { getSettings } from '@/lib/supabase-admin'
import type { HeroBanner, PromoBanner } from '@/types'

export const revalidate = 60

export default async function Home() {
  let heroBanner: HeroBanner | null = null
  let promoBanner: PromoBanner | null = null

  try {
    const settings = await getSettings()
    const settingsMap: Record<string, unknown> = {}
    for (const s of settings) {
      settingsMap[s.setting_key] = s.setting_value
    }
    heroBanner = (settingsMap.hero_banner as HeroBanner) || null
    promoBanner = (settingsMap.promo_banner as PromoBanner) || null
  } catch {
    // Fallback silencioso — pagina renderiza sem banners
  }

  return <HomeClient heroBanner={heroBanner} promoBanner={promoBanner} />
}
