'use client'

import { useEffect, useState } from 'react'
import { Save, Loader2, RotateCcw, Image as ImageIcon } from 'lucide-react'
import type { HeroBanner, PromoBanner, ThemeColors } from '@/types'

const defaultTheme: ThemeColors = {
  primary: '#6C5CE7',
  primary_dark: '#5A4BD1',
  primary_light: '#A29BFE',
  accent: '#FF6B6B',
  success: '#00B894',
  warning: '#FDCB6E',
  info: '#0984E3',
  bg: '#F8F9FE',
  bg_elevated: '#FFFFFF',
  bg_sunken: '#F1F2F6',
  card: '#FFFFFF',
  text: '#2D3436',
  text_secondary: '#636E72',
  text_muted: '#B2BEC3',
}

const defaultHero: HeroBanner = {
  title: 'Vista a camisa do seu time',
  subtitle: 'Camisas oficiais de NBA, NFL, MLB, NHL e Futebol. Qualidade premium com entrega para todo Brasil.',
  cta_text: 'Explorar Catalogo',
  cta_link: '/catalogo',
  background_image: null,
}

const defaultPromo: PromoBanner = {
  title: 'Ate 40% OFF na colecao Retro',
  subtitle: 'Camisas classicas que marcaram epoca. Michael Jordan, Ronaldo, Kobe Bryant e muito mais.',
  badge_text: 'Oferta por tempo limitado',
  cta_text: 'Ver Colecao Retro',
  cta_link: '/catalogo/retro',
  background_image: null,
}

type Tab = 'banners' | 'design'

const colorGroups = [
  {
    label: 'Cores Brand',
    fields: [
      { key: 'primary', label: 'Primary' },
      { key: 'primary_dark', label: 'Primary Dark' },
      { key: 'primary_light', label: 'Primary Light' },
      { key: 'accent', label: 'Accent' },
    ],
  },
  {
    label: 'Status',
    fields: [
      { key: 'success', label: 'Success' },
      { key: 'warning', label: 'Warning' },
      { key: 'info', label: 'Info' },
    ],
  },
  {
    label: 'Background',
    fields: [
      { key: 'bg', label: 'Background' },
      { key: 'bg_elevated', label: 'Elevated' },
      { key: 'bg_sunken', label: 'Sunken' },
      { key: 'card', label: 'Card' },
    ],
  },
  {
    label: 'Texto',
    fields: [
      { key: 'text', label: 'Text' },
      { key: 'text_secondary', label: 'Secondary' },
      { key: 'text_muted', label: 'Muted' },
    ],
  },
]

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState<Tab>('banners')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [hero, setHero] = useState<HeroBanner>(defaultHero)
  const [promo, setPromo] = useState<PromoBanner>(defaultPromo)
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        const settings = data.settings || []
        for (const s of settings) {
          if (s.setting_key === 'hero_banner') setHero({ ...defaultHero, ...s.setting_value })
          if (s.setting_key === 'promo_banner') setPromo({ ...defaultPromo, ...s.setting_value })
          if (s.setting_key === 'theme_colors') setTheme({ ...defaultTheme, ...s.setting_value })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const saveSetting = async (key: string, value: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/settings/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    })
    if (!res.ok) throw new Error('Erro ao salvar')
  }

  const handleSaveBanners = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await Promise.all([
        saveSetting('hero_banner', hero as unknown as Record<string, unknown>),
        saveSetting('promo_banner', promo as unknown as Record<string, unknown>),
      ])
      setMessage({ type: 'success', text: 'Banners salvos com sucesso!' })
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar banners' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveTheme = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await saveSetting('theme_colors', theme as unknown as Record<string, unknown>)
      setMessage({ type: 'success', text: 'Tema salvo com sucesso! Recarregue a pagina para ver as alteracoes.' })
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar tema' })
    } finally {
      setSaving(false)
    }
  }

  const resetTheme = () => setTheme(defaultTheme)

  const inputClass =
    'w-full px-4 py-2.5 bg-[#F8F9FE] rounded-xl border border-gray-200 text-sm text-[#2D3436] outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10'

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-shimmer rounded" />
        <div className="h-96 animate-shimmer rounded-2xl" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-[#2D3436] mb-6">Configuracoes</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => { setTab('banners'); setMessage(null) }}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === 'banners' ? 'bg-white text-[#2D3436] shadow-sm' : 'text-[#636E72] hover:text-[#2D3436]'
          }`}
        >
          Banners
        </button>
        <button
          onClick={() => { setTab('design'); setMessage(null) }}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === 'design' ? 'bg-white text-[#2D3436] shadow-sm' : 'text-[#636E72] hover:text-[#2D3436]'
          }`}
        >
          Design System
        </button>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-xl mb-6 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Banners Tab */}
      {tab === 'banners' && (
        <div className="space-y-8">
          {/* Hero Banner */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#2D3436] mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-[#6C5CE7]" />
              Hero Banner
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#636E72] mb-1.5">Titulo</label>
                <input
                  type="text"
                  value={hero.title}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#636E72] mb-1.5">Subtitulo</label>
                <textarea
                  value={hero.subtitle}
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                  rows={2}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#636E72] mb-1.5">Texto do CTA</label>
                  <input
                    type="text"
                    value={hero.cta_text}
                    onChange={(e) => setHero({ ...hero, cta_text: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#636E72] mb-1.5">Link do CTA</label>
                  <input
                    type="text"
                    value={hero.cta_link}
                    onChange={(e) => setHero({ ...hero, cta_link: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#636E72] mb-1.5">
                  URL da Imagem de Fundo (opcional)
                </label>
                <input
                  type="url"
                  value={hero.background_image || ''}
                  onChange={(e) => setHero({ ...hero, background_image: e.target.value || null })}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              {/* Preview */}
              <div
                className="rounded-xl p-8 text-white text-center min-h-[120px] flex flex-col items-center justify-center"
                style={hero.background_image ? {
                  backgroundImage: `url(${hero.background_image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : {
                  background: 'linear-gradient(to bottom right, #1a1a2e, #16213e, #0f3460)',
                }}
              >
                <h4 className="text-xl font-black">{hero.title}</h4>
                <p className="text-sm text-white/60 mt-1">{hero.subtitle}</p>
                <span className="mt-3 px-4 py-1.5 bg-[var(--primary)] rounded-lg text-xs font-semibold">
                  {hero.cta_text}
                </span>
              </div>
            </div>
          </div>

          {/* Promo Banner */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#2D3436] mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-[#FF6B6B]" />
              Promo Banner
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#636E72] mb-1.5">Titulo</label>
                <input
                  type="text"
                  value={promo.title}
                  onChange={(e) => setPromo({ ...promo, title: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#636E72] mb-1.5">Subtitulo</label>
                <textarea
                  value={promo.subtitle}
                  onChange={(e) => setPromo({ ...promo, subtitle: e.target.value })}
                  rows={2}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#636E72] mb-1.5">Badge Text</label>
                <input
                  type="text"
                  value={promo.badge_text}
                  onChange={(e) => setPromo({ ...promo, badge_text: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#636E72] mb-1.5">Texto do CTA</label>
                  <input
                    type="text"
                    value={promo.cta_text}
                    onChange={(e) => setPromo({ ...promo, cta_text: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#636E72] mb-1.5">Link do CTA</label>
                  <input
                    type="text"
                    value={promo.cta_link}
                    onChange={(e) => setPromo({ ...promo, cta_link: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#636E72] mb-1.5">
                  URL da Imagem de Fundo (opcional)
                </label>
                <input
                  type="url"
                  value={promo.background_image || ''}
                  onChange={(e) => setPromo({ ...promo, background_image: e.target.value || null })}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              {/* Preview */}
              <div
                className="rounded-xl p-8 text-white text-center min-h-[120px] flex flex-col items-center justify-center"
                style={promo.background_image ? {
                  backgroundImage: `url(${promo.background_image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : {
                  background: 'linear-gradient(to bottom right, #6C5CE7, #5A4BD1, #A29BFE)',
                }}
              >
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full mb-2">{promo.badge_text}</span>
                <h4 className="text-xl font-black">{promo.title}</h4>
                <p className="text-sm text-white/70 mt-1">{promo.subtitle}</p>
                <span className="mt-3 px-4 py-1.5 bg-white text-[#6C5CE7] rounded-lg text-xs font-semibold">
                  {promo.cta_text}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveBanners}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Salvando...' : 'Salvar Banners'}
          </button>
        </div>
      )}

      {/* Design System Tab */}
      {tab === 'design' && (
        <div className="space-y-8">
          {colorGroups.map((group) => (
            <div key={group.label} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#2D3436] mb-4">{group.label}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {group.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-[#636E72] mb-1.5">
                      {field.label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme[field.key as keyof ThemeColors]}
                        onChange={(e) => setTheme({ ...theme, [field.key]: e.target.value })}
                        className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={theme[field.key as keyof ThemeColors]}
                        onChange={(e) => setTheme({ ...theme, [field.key]: e.target.value })}
                        className="flex-1 px-3 py-2 bg-[#F8F9FE] rounded-lg border border-gray-200 text-xs font-mono outline-none focus:border-[#6C5CE7]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Preview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#2D3436] mb-4">Preview</h3>
            <div className="rounded-xl p-6" style={{ background: theme.bg }}>
              <div className="flex gap-4 mb-4">
                <div className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: theme.primary }}>
                  Primary
                </div>
                <div className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: theme.primary_dark }}>
                  Dark
                </div>
                <div className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: theme.accent }}>
                  Accent
                </div>
                <div className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: theme.success }}>
                  Success
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ background: theme.card }}>
                <p style={{ color: theme.text }} className="font-bold">Texto principal</p>
                <p style={{ color: theme.text_secondary }} className="text-sm">Texto secundario</p>
                <p style={{ color: theme.text_muted }} className="text-xs">Texto muted</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetTheme}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-[#636E72] rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <RotateCcw size={16} />
              Restaurar Padrao
            </button>
            <button
              onClick={handleSaveTheme}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Salvando...' : 'Salvar Tema'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
