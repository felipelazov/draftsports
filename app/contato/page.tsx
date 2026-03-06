'use client'

import { Mail, MessageCircle, Clock } from 'lucide-react'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

export default function ContatoPage() {
  const { pageContato } = useSiteSettings()

  const whatsappFormatted = pageContato.whatsapp_number.replace(
    /^(\d{2})(\d{2})(\d{5})(\d{4})$/,
    '($2) $3-$4'
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-black text-[#2D3436] mb-2">{pageContato.title}</h1>
      <p className="text-[#636E72] mb-10">{pageContato.subtitle}</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href={`https://wa.me/${pageContato.whatsapp_number}?text=Olá! Preciso de ajuda.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 p-6 border border-gray-100 rounded-2xl hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
            <MessageCircle size={24} className="text-[#25D366]" />
          </div>
          <div>
            <h2 className="font-bold text-[#2D3436]">WhatsApp</h2>
            <p className="text-sm text-[#636E72] mt-1">{pageContato.whatsapp_text}</p>
            <p className="text-sm font-semibold text-[#25D366] mt-2">{whatsappFormatted}</p>
          </div>
        </a>

        <a
          href={`mailto:${pageContato.email}`}
          className="flex items-start gap-4 p-6 border border-gray-100 rounded-2xl hover:border-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#6C5CE7]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#6C5CE7]/20 transition-colors">
            <Mail size={24} className="text-[#6C5CE7]" />
          </div>
          <div>
            <h2 className="font-bold text-[#2D3436]">E-mail</h2>
            <p className="text-sm text-[#636E72] mt-1">{pageContato.email_response_time}</p>
            <p className="text-sm font-semibold text-[#6C5CE7] mt-2">{pageContato.email}</p>
          </div>
        </a>
      </div>

      {pageContato.hours.length > 0 && (
        <div className="mt-8 p-6 bg-[#F8F9FE] rounded-2xl flex items-start gap-3">
          <Clock size={20} className="text-[#6C5CE7] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-[#2D3436]">Horário de Atendimento</p>
            {pageContato.hours.map((h, i) => (
              <p key={i} className="text-sm text-[#636E72] mt-1">{h}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
