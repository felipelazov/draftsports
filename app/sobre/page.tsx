'use client'

import Link from 'next/link'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { ContentRenderer } from '@/components/ui/ContentRenderer'

export default function SobrePage() {
  const { pageSobre } = useSiteSettings()

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-black text-[#2D3436] mb-8">{pageSobre.title}</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-[#636E72]">
        {pageSobre.intro && (
          <p className="text-lg leading-relaxed">{pageSobre.intro}</p>
        )}

        {pageSobre.sections.map((section, i) => (
          <div key={i}>
            <h2 className="text-xl font-bold text-[#2D3436] mt-8">{section.title}</h2>
            <ContentRenderer content={section.content} className="space-y-2" />
          </div>
        ))}

        <div className="mt-12 p-6 bg-[#F8F9FE] rounded-2xl">
          <p className="text-sm text-[#636E72]">
            Tem alguma dúvida? <Link href="/faq" className="text-[#6C5CE7] font-semibold hover:underline">Acesse nosso FAQ</Link> ou
            entre em <Link href="/contato" className="text-[#6C5CE7] font-semibold hover:underline">contato conosco</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
