'use client'

import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { ContentRenderer } from '@/components/ui/ContentRenderer'

export default function TermosPage() {
  const { pageTermos } = useSiteSettings()

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-black text-[#2D3436] mb-8">{pageTermos.title}</h1>

      <div className="space-y-6 text-[#636E72] text-sm leading-relaxed">
        {pageTermos.intro && <p>{pageTermos.intro}</p>}

        {pageTermos.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg font-bold text-[#2D3436] mb-2">{section.title}</h2>
            <ContentRenderer content={section.content} className="space-y-1" />
          </section>
        ))}
      </div>
    </div>
  )
}
