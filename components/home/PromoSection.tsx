'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Zap, Truck, Shield, RotateCcw, Heart, Star, Check, type LucideIcon } from 'lucide-react'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

const iconMap: Record<string, LucideIcon> = {
  Truck, Shield, RotateCcw, Zap, Heart, Star, Check,
}

interface PromoSectionProps {
  title?: string
  subtitle?: string
  badgeText?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: string | null
}

export function PromoSection({ title, subtitle, badgeText, ctaText, ctaLink, backgroundImage }: PromoSectionProps = {}) {
  const { features: featuresConfig } = useSiteSettings()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <>
      {/* Promo Banner */}
      <section
        ref={ref}
        className="relative py-24 overflow-hidden"
        style={backgroundImage ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {
          background: 'linear-gradient(to bottom right, #6C5CE7, #5A4BD1, #A29BFE)',
        }}
      >
        <motion.div
          style={{ y }}
          className="absolute inset-0 opacity-10"
        >
          <div className="absolute top-10 left-10 text-[200px] font-black text-white/20 select-none leading-none">
            DRAFT
          </div>
          <div className="absolute bottom-10 right-10 text-[150px] font-black text-white/10 select-none leading-none rotate-12">
            2026
          </div>
        </motion.div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-sm font-semibold mb-6 backdrop-blur-sm">
              {badgeText || 'Oferta por tempo limitado'}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
              {title || (<>Ate <span className="text-[#FF6B6B]">40% OFF</span><br />na colecao Retro</>)}
            </h2>
            <p className="text-lg text-white/70 mt-4 max-w-xl mx-auto">
              {subtitle || 'Camisas classicas que marcaram epoca. Michael Jordan, Ronaldo, Kobe Bryant e muito mais.'}
            </p>
            <Link href={ctaLink || '/catalogo/retro'}>
              <Button
                size="lg"
                className="mt-8 bg-white text-[#6C5CE7] hover:bg-white/90 hover:shadow-2xl"
              >
                {ctaText || 'Ver Colecao Retro'}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuresConfig.items.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Zap
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#6C5CE7]/10 text-[#6C5CE7] mb-3 group-hover:bg-[#6C5CE7] group-hover:text-white transition-all duration-300">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-[#2D3436]">{feature.title}</h3>
                  <p className="text-sm text-[#636E72] mt-1">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
