'use client'

import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { ContentRenderer } from '@/components/ui/ContentRenderer'

export default function TrocasPage() {
  const { pageTrocas } = useSiteSettings()

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-black text-[#2D3436] mb-8">{pageTrocas.title}</h1>

      <div className="space-y-8 text-[#636E72]">
        {pageTrocas.intro && (
          <p className="leading-relaxed">{pageTrocas.intro}</p>
        )}

        {pageTrocas.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-xl font-bold text-[#2D3436] mb-3">{section.title}</h2>
            <ContentRenderer content={section.content} className="space-y-2" />
          </section>
        ))}

        {pageTrocas.note && (
          <div className="p-6 bg-[#F8F9FE] rounded-2xl">
            <p className="text-sm font-medium text-[#2D3436]">{pageTrocas.note.title}</p>
            <p className="text-sm mt-1">{pageTrocas.note.content}</p>
          </div>
        )}
      </div>
    </div>
  )
}
