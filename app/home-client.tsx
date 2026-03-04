'use client'

import { Hero3D } from '@/components/home/Hero3D'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel'
import { NewArrivals } from '@/components/home/NewArrivals'
import { PromoSection } from '@/components/home/PromoSection'
import type { HeroBanner, PromoBanner } from '@/types'

interface HomeClientProps {
  heroBanner: HeroBanner | null
  promoBanner: PromoBanner | null
}

export function HomeClient({ heroBanner, promoBanner }: HomeClientProps) {
  return (
    <>
      <Hero3D
        title={heroBanner?.title}
        subtitle={heroBanner?.subtitle}
        ctaText={heroBanner?.cta_text}
        ctaLink={heroBanner?.cta_link}
        backgroundImage={heroBanner?.background_image}
      />
      <CategoryGrid />
      <FeaturedCarousel />
      <PromoSection
        title={promoBanner?.title}
        subtitle={promoBanner?.subtitle}
        badgeText={promoBanner?.badge_text}
        ctaText={promoBanner?.cta_text}
        ctaLink={promoBanner?.cta_link}
        backgroundImage={promoBanner?.background_image}
      />
      <NewArrivals />
    </>
  )
}
