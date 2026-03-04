import { HomeClient } from './home-client'
import type { HeroBanner, PromoBanner } from '@/types'

async function getSettings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

    const res = await fetch(`${baseUrl}/api/settings`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function Home() {
  const settings = await getSettings()

  const heroBanner = (settings?.hero_banner as HeroBanner) || null
  const promoBanner = (settings?.promo_banner as PromoBanner) || null

  return <HomeClient heroBanner={heroBanner} promoBanner={promoBanner} />
}
