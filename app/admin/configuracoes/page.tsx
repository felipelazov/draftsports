'use client'

import { useEffect, useState, useRef } from 'react'
import {
  Save, Loader2, RotateCcw, Image as ImageIcon, Upload, X, Link2, MessageCircle,
  Store, Home, Package, ShoppingCart, Palette, Plus, Trash2
} from 'lucide-react'
import type {
  HeroBanner, PromoBanner, ThemeColors, SiteLinks, StoreInfo,
  HomepageSections, HomepageFeatures, HomepageFeature, NewsletterConfig,
  ProductConfig, ProductBenefit, CheckoutConfig, ShippingRegion, Coupon, SecuritySeal,
  FooterConfig, FooterColumn
} from '@/types'

const defaultTheme: ThemeColors = {
  primary: '#6C5CE7', primary_dark: '#5A4BD1', primary_light: '#A29BFE',
  accent: '#FF6B6B', success: '#00B894', warning: '#FDCB6E', info: '#0984E3',
  bg: '#F8F9FE', bg_elevated: '#FFFFFF', bg_sunken: '#F1F2F6', card: '#FFFFFF',
  text: '#2D3436', text_secondary: '#636E72', text_muted: '#B2BEC3',
}

const defaultHero: HeroBanner = {
  title: 'Vista a camisa do seu time', subtitle: 'Camisas oficiais de NBA, NFL, MLB, NHL e Futebol. Qualidade premium com entrega para todo Brasil.',
  cta_text: 'Explorar Catalogo', cta_link: '/catalogo', background_image: null, card_media: null, card_media_type: null,
  badge_text: 'Nova coleção 2026 disponível', secondary_cta_text: 'Coleção Retro', secondary_cta_link: '/catalogo/retro',
  stats: [{ value: '5K+', label: 'Clientes' }, { value: '500+', label: 'Produtos' }, { value: '4.9', label: 'Avaliação' }],
}

const defaultPromo: PromoBanner = {
  title: 'Ate 40% OFF na colecao Retro', subtitle: 'Camisas classicas que marcaram epoca. Michael Jordan, Ronaldo, Kobe Bryant e muito mais.',
  badge_text: 'Oferta por tempo limitado', cta_text: 'Ver Colecao Retro', cta_link: '/catalogo/retro', background_image: null,
}

const defaultLinks: SiteLinks = {
  whatsapp_number: '5511999999999', whatsapp_message: 'Olá! Vim pelo site DRAFT e gostaria de mais informações.',
  instagram_url: '', twitter_url: '', youtube_url: '', email: 'contato@draftsports.com.br',
}

const defaultStoreInfo: StoreInfo = {
  name: 'DRAFT', description: 'A melhor loja de camisas esportivas americanas do Brasil. Autenticidade e estilo em cada peça.',
  copyright: '© 2026 DRAFT. Todos os direitos reservados.',
}

const defaultSections: HomepageSections = {
  categories_title: 'Escolha sua liga', categories_subtitle: 'As maiores ligas esportivas do mundo em um só lugar',
  featured_title: 'Destaques da semana', featured_subtitle: 'Os produtos mais populares escolhidos para você',
  live_title: 'Jogos ao Vivo', live_subtitle: 'Acompanhe os jogos de hoje e vista a camisa do seu time',
  new_arrivals_title: 'Novos lançamentos', new_arrivals_subtitle: 'As últimas camisas que acabaram de chegar',
  new_arrivals_cta: 'Ver Todo o Catálogo',
}

const defaultFeatures: HomepageFeatures = {
  items: [
    { icon: 'Truck', title: 'Frete Grátis', description: 'Em compras acima de R$ 299' },
    { icon: 'Shield', title: '100% Original', description: 'Garantia de autenticidade' },
    { icon: 'RotateCcw', title: 'Troca Fácil', description: '30 dias para trocar' },
    { icon: 'Zap', title: 'Entrega Rápida', description: 'Receba em até 5 dias' },
  ],
}

const defaultNewsletter: NewsletterConfig = {
  title: 'Receba ofertas exclusivas', subtitle: 'Cadastre-se e ganhe 10% de desconto na primeira compra', button_text: 'Inscrever',
}

const defaultProductConfig: ProductConfig = {
  benefits: [
    { icon: 'Truck', title: 'Frete Gratis', subtitle: 'Acima de R$ 299' },
    { icon: 'Shield', title: '100% Original', subtitle: 'Garantia total' },
    { icon: 'RotateCcw', title: 'Troca Facil', subtitle: 'Ate 30 dias' },
  ],
  installments: 3, out_of_stock_title: 'Produto esgotado', out_of_stock_message: 'Deixe seu e-mail e avisaremos quando este produto voltar.',
}

const defaultCheckoutConfig: CheckoutConfig = {
  pix_discount_percent: 5, free_shipping_min: 299,
  shipping_regions: [
    { name: 'SP', cep_start: 0, cep_end: 1, price: 0, days: 5 },
    { name: 'RJ/MG/ES', cep_start: 2, cep_end: 3, price: 14.90, days: 7 },
    { name: 'Sul/Centro-Oeste', cep_start: 4, cep_end: 5, price: 24.90, days: 10 },
    { name: 'Norte/Nordeste', cep_start: 6, cep_end: 9, price: 34.90, days: 12 },
  ],
  coupons: [
    { code: 'PRIMEIRACOMPRA', type: 'percent', value: 10, active: true },
    { code: 'DRAFT10', type: 'percent', value: 10, active: true },
    { code: 'DRAFT20', type: 'fixed', value: 20, active: true },
  ],
  security_seals: [
    { icon: 'Lock', text: 'Compra Segura' },
    { icon: 'Check', text: 'Dados Protegidos' },
    { icon: 'CreditCard', text: 'Mercado Pago' },
  ],
}

const defaultFooterConfig: FooterConfig = {
  columns: [
    { title: 'Ligas', links: [{ name: 'NBA', href: '/catalogo/nba' }, { name: 'NFL', href: '/catalogo/nfl' }, { name: 'MLB', href: '/catalogo/mlb' }, { name: 'NHL', href: '/catalogo/nhl' }, { name: 'Futebol', href: '/catalogo/futebol' }] },
    { title: 'Institucional', links: [{ name: 'Sobre Nós', href: '/sobre' }, { name: 'Política de Privacidade', href: '/privacidade' }, { name: 'Termos de Uso', href: '/termos' }, { name: 'Trocas e Devoluções', href: '/trocas' }] },
    { title: 'Ajuda', links: [{ name: 'Perguntas Frequentes', href: '/faq' }, { name: 'Rastrear Pedido', href: '/conta/pedidos' }, { name: 'Guia de Tamanhos', href: '/tamanhos' }, { name: 'Contato', href: '/contato' }] },
  ],
  payment_methods: ['PIX', 'Visa', 'Master', 'Amex'],
}

const colorGroups = [
  { label: 'Cores Brand', fields: [{ key: 'primary', label: 'Primary' }, { key: 'primary_dark', label: 'Primary Dark' }, { key: 'primary_light', label: 'Primary Light' }, { key: 'accent', label: 'Accent' }] },
  { label: 'Status', fields: [{ key: 'success', label: 'Success' }, { key: 'warning', label: 'Warning' }, { key: 'info', label: 'Info' }] },
  { label: 'Background', fields: [{ key: 'bg', label: 'Background' }, { key: 'bg_elevated', label: 'Elevated' }, { key: 'bg_sunken', label: 'Sunken' }, { key: 'card', label: 'Card' }] },
  { label: 'Texto', fields: [{ key: 'text', label: 'Text' }, { key: 'text_secondary', label: 'Secondary' }, { key: 'text_muted', label: 'Muted' }] },
]

const themeVarMap: Record<string, string> = {
  primary: '--primary', primary_dark: '--primary-dark', primary_light: '--primary-light', accent: '--accent',
  success: '--success', warning: '--warning', info: '--info', bg: '--bg', bg_elevated: '--bg-elevated',
  bg_sunken: '--bg-sunken', card: '--card', text: '--text', text_secondary: '--text-secondary', text_muted: '--text-muted',
}

type Tab = 'loja' | 'homepage' | 'produto' | 'checkout' | 'design' | 'links'

const TABS: { id: Tab; label: string; icon: typeof Store }[] = [
  { id: 'loja', label: 'Loja', icon: Store },
  { id: 'homepage', label: 'Homepage', icon: Home },
  { id: 'produto', label: 'Produto', icon: Package },
  { id: 'checkout', label: 'Checkout', icon: ShoppingCart },
  { id: 'design', label: 'Design System', icon: Palette },
  { id: 'links', label: 'Links & Redes', icon: Link2 },
]

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState<Tab>('loja')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [hero, setHero] = useState<HeroBanner>(defaultHero)
  const [promo, setPromo] = useState<PromoBanner>(defaultPromo)
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme)
  const [links, setLinks] = useState<SiteLinks>(defaultLinks)
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(defaultStoreInfo)
  const [sections, setSections] = useState<HomepageSections>(defaultSections)
  const [features, setFeatures] = useState<HomepageFeatures>(defaultFeatures)
  const [newsletter, setNewsletter] = useState<NewsletterConfig>(defaultNewsletter)
  const [productConfig, setProductConfig] = useState<ProductConfig>(defaultProductConfig)
  const [checkoutConfig, setCheckoutConfig] = useState<CheckoutConfig>(defaultCheckoutConfig)
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(defaultFooterConfig)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        const settings = data.settings || []
        for (const s of settings) {
          if (s.setting_key === 'hero_banner') setHero({ ...defaultHero, ...s.setting_value })
          if (s.setting_key === 'promo_banner') setPromo({ ...defaultPromo, ...s.setting_value })
          if (s.setting_key === 'theme_colors') setTheme({ ...defaultTheme, ...s.setting_value })
          if (s.setting_key === 'site_links') setLinks({ ...defaultLinks, ...s.setting_value })
          if (s.setting_key === 'store_info') setStoreInfo({ ...defaultStoreInfo, ...s.setting_value })
          if (s.setting_key === 'homepage_sections') setSections({ ...defaultSections, ...s.setting_value })
          if (s.setting_key === 'homepage_features') setFeatures({ ...defaultFeatures, ...s.setting_value })
          if (s.setting_key === 'newsletter') setNewsletter({ ...defaultNewsletter, ...s.setting_value })
          if (s.setting_key === 'product_config') setProductConfig({ ...defaultProductConfig, ...s.setting_value })
          if (s.setting_key === 'checkout_config') setCheckoutConfig({ ...defaultCheckoutConfig, ...s.setting_value })
          if (s.setting_key === 'footer_config') setFooterConfig({ ...defaultFooterConfig, ...s.setting_value })
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

  const saveWith = async (saves: [string, unknown][]) => {
    setSaving(true)
    setMessage(null)
    try {
      await Promise.all(saves.map(([key, val]) => saveSetting(key, val as Record<string, unknown>)))
      setMessage({ type: 'success', text: 'Salvo com sucesso!' })
    } catch {
      setMessage({ type: 'error', text: 'Erro ao salvar' })
    } finally {
      setSaving(false)
    }
  }

  const handleCardMediaUpload = async (file: File) => {
    setUploading(true)
    try {
      const isVideo = file.type.startsWith('video/')
      const formData = new FormData()
      if (isVideo) {
        formData.append('file', file)
        const res = await fetch('/api/admin/upload/video', { method: 'POST', body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setHero({ ...hero, card_media: data.url, card_media_type: 'video' })
      } else {
        formData.append('files', file)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setHero({ ...hero, card_media: data.urls[0], card_media_type: 'image' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao fazer upload do arquivo' })
    } finally {
      setUploading(false)
    }
  }

  const resetTheme = async () => {
    setTheme(defaultTheme)
    setSaving(true)
    setMessage(null)
    try {
      await saveSetting('theme_colors', defaultTheme as unknown as Record<string, unknown>)
      const root = document.documentElement
      for (const [key, value] of Object.entries(defaultTheme)) {
        const varName = themeVarMap[key]
        if (varName) root.style.setProperty(varName, value)
      }
      setMessage({ type: 'success', text: 'Tema restaurado ao padrao!' })
    } catch {
      setMessage({ type: 'error', text: 'Erro ao restaurar tema' })
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 bg-[var(--gray-100)] rounded-xl border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10'
  const smallInputClass =
    'px-3 py-2 bg-[var(--gray-100)] rounded-lg border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[#6C5CE7]'

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
      <h1 className="text-2xl font-black text-[var(--text)] mb-6">Configuracoes</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--gray-100)] rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setMessage(null) }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              tab === t.id ? 'bg-[var(--card)] text-[var(--text)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl mb-6 text-sm ${
          message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* ===== TAB: LOJA ===== */}
      {tab === 'loja' && (
        <div className="space-y-8">
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
              <Store size={20} className="text-[#6C5CE7]" />
              Informacoes da Loja
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Nome da Loja</label>
                <input type="text" value={storeInfo.name} onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Descricao</label>
                <textarea value={storeInfo.description} onChange={(e) => setStoreInfo({ ...storeInfo, description: e.target.value })} rows={2} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Copyright</label>
                <input type="text" value={storeInfo.copyright} onChange={(e) => setStoreInfo({ ...storeInfo, copyright: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>
          <button onClick={() => saveWith([['store_info', storeInfo]])} disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Salvando...' : 'Salvar Loja'}
          </button>
        </div>
      )}

      {/* ===== TAB: HOMEPAGE ===== */}
      {tab === 'homepage' && (
        <div className="space-y-8">
          {/* Hero Banner */}
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-[#6C5CE7]" />
              Hero Banner
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Titulo</label>
                <input type="text" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Subtitulo</label>
                <textarea value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} rows={2} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Texto do CTA</label>
                  <input type="text" value={hero.cta_text} onChange={(e) => setHero({ ...hero, cta_text: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Link do CTA</label>
                  <input type="text" value={hero.cta_link} onChange={(e) => setHero({ ...hero, cta_link: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Badge Text</label>
                <input type="text" value={hero.badge_text} onChange={(e) => setHero({ ...hero, badge_text: e.target.value })} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">CTA Secundario (texto)</label>
                  <input type="text" value={hero.secondary_cta_text} onChange={(e) => setHero({ ...hero, secondary_cta_text: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">CTA Secundario (link)</label>
                  <input type="text" value={hero.secondary_cta_link} onChange={(e) => setHero({ ...hero, secondary_cta_link: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">URL da Imagem de Fundo (opcional)</label>
                <input type="url" value={hero.background_image || ''} onChange={(e) => setHero({ ...hero, background_image: e.target.value || null })} placeholder="https://..." className={inputClass} />
              </div>

              {/* Stats */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Estatisticas do Hero</label>
                <div className="space-y-2">
                  {(hero.stats || []).map((stat, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input type="text" value={stat.value} placeholder="5K+" onChange={(e) => { const s = [...hero.stats]; s[i] = { ...s[i], value: e.target.value }; setHero({ ...hero, stats: s }) }} className={`${smallInputClass} w-24`} />
                      <input type="text" value={stat.label} placeholder="Clientes" onChange={(e) => { const s = [...hero.stats]; s[i] = { ...s[i], label: e.target.value }; setHero({ ...hero, stats: s }) }} className={`${smallInputClass} flex-1`} />
                      <button onClick={() => { const s = hero.stats.filter((_, idx) => idx !== i); setHero({ ...hero, stats: s }) }} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => setHero({ ...hero, stats: [...(hero.stats || []), { value: '', label: '' }] })} className="text-xs text-[#6C5CE7] font-semibold flex items-center gap-1"><Plus size={12} /> Adicionar stat</button>
                </div>
              </div>

              {/* Card Media */}
              <div className="border-t border-[var(--gray-100)] pt-4">
                <h4 className="text-sm font-semibold text-[var(--text)] mb-3">Midia do Card (foto ou video)</h4>
                <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden"
                  onChange={(e) => { const file = e.target.files?.[0]; if (file) handleCardMediaUpload(file); e.target.value = '' }} />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[var(--gray-300)] rounded-xl text-sm text-[var(--text-secondary)] hover:border-[#6C5CE7] hover:text-[#6C5CE7] transition-colors disabled:opacity-50">
                  {uploading ? (<><Loader2 size={16} className="animate-spin" /> Enviando...</>) : (<><Upload size={16} /> Enviar imagem ou video</>)}
                </button>
                <div className="flex items-center gap-3 my-3"><div className="flex-1 h-px bg-[var(--gray-200)]" /><span className="text-xs text-[var(--text-secondary)]">ou cole uma URL</span><div className="flex-1 h-px bg-[var(--gray-200)]" /></div>
                <div className="flex gap-2">
                  <select value={hero.card_media_type || ''} onChange={(e) => setHero({ ...hero, card_media_type: (e.target.value as 'image' | 'video') || null, card_media: e.target.value ? hero.card_media : null })} className={smallInputClass}>
                    <option value="">Nenhum</option><option value="image">Imagem</option><option value="video">Video</option>
                  </select>
                  {hero.card_media_type && (
                    <input type="url" value={hero.card_media || ''} onChange={(e) => setHero({ ...hero, card_media: e.target.value || null })} placeholder="https://..." className={`flex-1 ${smallInputClass}`} />
                  )}
                </div>
                {hero.card_media && (
                  <div className="relative rounded-xl overflow-hidden border border-[var(--gray-200)] max-w-[200px] mt-3">
                    {hero.card_media_type === 'video' ? (
                      <video src={hero.card_media} autoPlay loop muted playsInline className="w-full h-40 object-cover" />
                    ) : (
                      <img src={hero.card_media} alt="Preview" className="w-full h-40 object-cover" />
                    )}
                    <button type="button" onClick={() => setHero({ ...hero, card_media: null, card_media_type: null })}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"><X size={14} /></button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Promo Banner */}
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-[#FF6B6B]" />
              Promo Banner
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Titulo</label>
                <input type="text" value={promo.title} onChange={(e) => setPromo({ ...promo, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Subtitulo</label>
                <textarea value={promo.subtitle} onChange={(e) => setPromo({ ...promo, subtitle: e.target.value })} rows={2} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Badge Text</label>
                <input type="text" value={promo.badge_text} onChange={(e) => setPromo({ ...promo, badge_text: e.target.value })} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Texto do CTA</label>
                  <input type="text" value={promo.cta_text} onChange={(e) => setPromo({ ...promo, cta_text: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Link do CTA</label>
                  <input type="text" value={promo.cta_link} onChange={(e) => setPromo({ ...promo, cta_link: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">URL da Imagem de Fundo (opcional)</label>
                <input type="url" value={promo.background_image || ''} onChange={(e) => setPromo({ ...promo, background_image: e.target.value || null })} placeholder="https://..." className={inputClass} />
              </div>
            </div>
          </div>

          {/* Titulos de Secao */}
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Titulos das Secoes</h3>
            <div className="space-y-4">
              {([
                ['categories_title', 'categories_subtitle', 'Categorias'],
                ['featured_title', 'featured_subtitle', 'Destaques'],
                ['live_title', 'live_subtitle', 'Jogos ao Vivo'],
                ['new_arrivals_title', 'new_arrivals_subtitle', 'Lancamentos'],
              ] as const).map(([titleKey, subKey, label]) => (
                <div key={titleKey} className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">{label} — Titulo</label>
                    <input type="text" value={sections[titleKey]} onChange={(e) => setSections({ ...sections, [titleKey]: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">{label} — Subtitulo</label>
                    <input type="text" value={sections[subKey]} onChange={(e) => setSections({ ...sections, [subKey]: e.target.value })} className={inputClass} />
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">CTA Lancamentos</label>
                <input type="text" value={sections.new_arrivals_cta} onChange={(e) => setSections({ ...sections, new_arrivals_cta: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Beneficios/Features</h3>
            <div className="space-y-3">
              {features.items.map((f, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select value={f.icon} onChange={(e) => { const items = [...features.items]; items[i] = { ...items[i], icon: e.target.value }; setFeatures({ items }) }} className={`${smallInputClass} w-28`}>
                    {['Truck', 'Shield', 'RotateCcw', 'Zap', 'Heart', 'Star', 'Check'].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                  <input type="text" value={f.title} placeholder="Titulo" onChange={(e) => { const items = [...features.items]; items[i] = { ...items[i], title: e.target.value }; setFeatures({ items }) }} className={`${smallInputClass} flex-1`} />
                  <input type="text" value={f.description} placeholder="Descricao" onChange={(e) => { const items = [...features.items]; items[i] = { ...items[i], description: e.target.value }; setFeatures({ items }) }} className={`${smallInputClass} flex-1`} />
                  <button onClick={() => setFeatures({ items: features.items.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              ))}
              <button onClick={() => setFeatures({ items: [...features.items, { icon: 'Star', title: '', description: '' }] })} className="text-xs text-[#6C5CE7] font-semibold flex items-center gap-1"><Plus size={12} /> Adicionar feature</button>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Newsletter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Titulo</label>
                <input type="text" value={newsletter.title} onChange={(e) => setNewsletter({ ...newsletter, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Subtitulo</label>
                <input type="text" value={newsletter.subtitle} onChange={(e) => setNewsletter({ ...newsletter, subtitle: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Texto do Botao</label>
                <input type="text" value={newsletter.button_text} onChange={(e) => setNewsletter({ ...newsletter, button_text: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          <button onClick={() => saveWith([['hero_banner', hero], ['promo_banner', promo], ['homepage_sections', sections], ['homepage_features', features], ['newsletter', newsletter]])} disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Salvando...' : 'Salvar Homepage'}
          </button>
        </div>
      )}

      {/* ===== TAB: PRODUTO ===== */}
      {tab === 'produto' && (
        <div className="space-y-8">
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Beneficios do Produto</h3>
            <div className="space-y-3">
              {productConfig.benefits.map((b, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select value={b.icon} onChange={(e) => { const benefits = [...productConfig.benefits]; benefits[i] = { ...benefits[i], icon: e.target.value }; setProductConfig({ ...productConfig, benefits }) }} className={`${smallInputClass} w-28`}>
                    {['Truck', 'Shield', 'RotateCcw', 'Zap', 'Heart', 'Star', 'Check'].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                  <input type="text" value={b.title} placeholder="Titulo" onChange={(e) => { const benefits = [...productConfig.benefits]; benefits[i] = { ...benefits[i], title: e.target.value }; setProductConfig({ ...productConfig, benefits }) }} className={`${smallInputClass} flex-1`} />
                  <input type="text" value={b.subtitle} placeholder="Subtitulo" onChange={(e) => { const benefits = [...productConfig.benefits]; benefits[i] = { ...benefits[i], subtitle: e.target.value }; setProductConfig({ ...productConfig, benefits }) }} className={`${smallInputClass} flex-1`} />
                  <button onClick={() => setProductConfig({ ...productConfig, benefits: productConfig.benefits.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              ))}
              <button onClick={() => setProductConfig({ ...productConfig, benefits: [...productConfig.benefits, { icon: 'Star', title: '', subtitle: '' }] })} className="text-xs text-[#6C5CE7] font-semibold flex items-center gap-1"><Plus size={12} /> Adicionar beneficio</button>
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Parcelamento e Estoque</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Numero de parcelas</label>
                <input type="number" min={1} max={12} value={productConfig.installments} onChange={(e) => setProductConfig({ ...productConfig, installments: parseInt(e.target.value) || 3 })} className={`${inputClass} w-32`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Titulo esgotado</label>
                <input type="text" value={productConfig.out_of_stock_title} onChange={(e) => setProductConfig({ ...productConfig, out_of_stock_title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Mensagem esgotado</label>
                <input type="text" value={productConfig.out_of_stock_message} onChange={(e) => setProductConfig({ ...productConfig, out_of_stock_message: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          <button onClick={() => saveWith([['product_config', productConfig]])} disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      )}

      {/* ===== TAB: CHECKOUT ===== */}
      {tab === 'checkout' && (
        <div className="space-y-8">
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Configuracoes Gerais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Desconto PIX (%)</label>
                <input type="number" min={0} max={30} value={checkoutConfig.pix_discount_percent} onChange={(e) => setCheckoutConfig({ ...checkoutConfig, pix_discount_percent: parseFloat(e.target.value) || 0 })} className={`${inputClass} w-32`} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Frete gratis acima de (R$)</label>
                <input type="number" min={0} value={checkoutConfig.free_shipping_min} onChange={(e) => setCheckoutConfig({ ...checkoutConfig, free_shipping_min: parseFloat(e.target.value) || 0 })} className={`${inputClass} w-32`} />
              </div>
            </div>
          </div>

          {/* Regioes de Frete */}
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Regioes de Frete</h3>
            <div className="space-y-2">
              {checkoutConfig.shipping_regions.map((r, i) => (
                <div key={i} className="flex gap-2 items-center flex-wrap">
                  <input type="text" value={r.name} placeholder="Nome" onChange={(e) => { const regions = [...checkoutConfig.shipping_regions]; regions[i] = { ...regions[i], name: e.target.value }; setCheckoutConfig({ ...checkoutConfig, shipping_regions: regions }) }} className={`${smallInputClass} w-32`} />
                  <input type="number" value={r.cep_start} placeholder="CEP ini" onChange={(e) => { const regions = [...checkoutConfig.shipping_regions]; regions[i] = { ...regions[i], cep_start: parseInt(e.target.value) }; setCheckoutConfig({ ...checkoutConfig, shipping_regions: regions }) }} className={`${smallInputClass} w-20`} />
                  <span className="text-xs text-[var(--text-secondary)]">a</span>
                  <input type="number" value={r.cep_end} placeholder="CEP fim" onChange={(e) => { const regions = [...checkoutConfig.shipping_regions]; regions[i] = { ...regions[i], cep_end: parseInt(e.target.value) }; setCheckoutConfig({ ...checkoutConfig, shipping_regions: regions }) }} className={`${smallInputClass} w-20`} />
                  <input type="number" step="0.01" value={r.price} placeholder="Preco" onChange={(e) => { const regions = [...checkoutConfig.shipping_regions]; regions[i] = { ...regions[i], price: parseFloat(e.target.value) }; setCheckoutConfig({ ...checkoutConfig, shipping_regions: regions }) }} className={`${smallInputClass} w-24`} />
                  <input type="number" value={r.days} placeholder="Dias" onChange={(e) => { const regions = [...checkoutConfig.shipping_regions]; regions[i] = { ...regions[i], days: parseInt(e.target.value) }; setCheckoutConfig({ ...checkoutConfig, shipping_regions: regions }) }} className={`${smallInputClass} w-16`} />
                  <span className="text-xs text-[var(--text-secondary)]">dias</span>
                  <button onClick={() => setCheckoutConfig({ ...checkoutConfig, shipping_regions: checkoutConfig.shipping_regions.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              ))}
              <button onClick={() => setCheckoutConfig({ ...checkoutConfig, shipping_regions: [...checkoutConfig.shipping_regions, { name: '', cep_start: 0, cep_end: 0, price: 0, days: 7 }] })} className="text-xs text-[#6C5CE7] font-semibold flex items-center gap-1"><Plus size={12} /> Adicionar regiao</button>
            </div>
          </div>

          {/* Cupons */}
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Cupons de Desconto</h3>
            <div className="space-y-2">
              {checkoutConfig.coupons.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="text" value={c.code} placeholder="CODIGO" onChange={(e) => { const coupons = [...checkoutConfig.coupons]; coupons[i] = { ...coupons[i], code: e.target.value.toUpperCase() }; setCheckoutConfig({ ...checkoutConfig, coupons }) }} className={`${smallInputClass} w-40`} />
                  <select value={c.type} onChange={(e) => { const coupons = [...checkoutConfig.coupons]; coupons[i] = { ...coupons[i], type: e.target.value as 'percent' | 'fixed' }; setCheckoutConfig({ ...checkoutConfig, coupons }) }} className={`${smallInputClass} w-28`}>
                    <option value="percent">%</option><option value="fixed">R$ fixo</option>
                  </select>
                  <input type="number" value={c.value} onChange={(e) => { const coupons = [...checkoutConfig.coupons]; coupons[i] = { ...coupons[i], value: parseFloat(e.target.value) }; setCheckoutConfig({ ...checkoutConfig, coupons }) }} className={`${smallInputClass} w-20`} />
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={c.active} onChange={(e) => { const coupons = [...checkoutConfig.coupons]; coupons[i] = { ...coupons[i], active: e.target.checked }; setCheckoutConfig({ ...checkoutConfig, coupons }) }} />
                    Ativo
                  </label>
                  <button onClick={() => setCheckoutConfig({ ...checkoutConfig, coupons: checkoutConfig.coupons.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              ))}
              <button onClick={() => setCheckoutConfig({ ...checkoutConfig, coupons: [...checkoutConfig.coupons, { code: '', type: 'percent', value: 10, active: true }] })} className="text-xs text-[#6C5CE7] font-semibold flex items-center gap-1"><Plus size={12} /> Adicionar cupom</button>
            </div>
          </div>

          {/* Selos de Seguranca */}
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Selos de Seguranca</h3>
            <div className="space-y-2">
              {checkoutConfig.security_seals.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select value={s.icon} onChange={(e) => { const seals = [...checkoutConfig.security_seals]; seals[i] = { ...seals[i], icon: e.target.value }; setCheckoutConfig({ ...checkoutConfig, security_seals: seals }) }} className={`${smallInputClass} w-28`}>
                    {['Lock', 'Check', 'CreditCard', 'Shield', 'Star'].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                  <input type="text" value={s.text} placeholder="Texto" onChange={(e) => { const seals = [...checkoutConfig.security_seals]; seals[i] = { ...seals[i], text: e.target.value }; setCheckoutConfig({ ...checkoutConfig, security_seals: seals }) }} className={`${smallInputClass} flex-1`} />
                  <button onClick={() => setCheckoutConfig({ ...checkoutConfig, security_seals: checkoutConfig.security_seals.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              ))}
              <button onClick={() => setCheckoutConfig({ ...checkoutConfig, security_seals: [...checkoutConfig.security_seals, { icon: 'Shield', text: '' }] })} className="text-xs text-[#6C5CE7] font-semibold flex items-center gap-1"><Plus size={12} /> Adicionar selo</button>
            </div>
          </div>

          <button onClick={() => saveWith([['checkout_config', checkoutConfig]])} disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Salvando...' : 'Salvar Checkout'}
          </button>
        </div>
      )}

      {/* ===== TAB: DESIGN SYSTEM ===== */}
      {tab === 'design' && (
        <div className="space-y-8">
          {colorGroups.map((group) => (
            <div key={group.label} className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[var(--text)] mb-4">{group.label}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {group.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">{field.label}</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={theme[field.key as keyof ThemeColors]} onChange={(e) => setTheme({ ...theme, [field.key]: e.target.value })} className="w-10 h-10 rounded-lg border border-[var(--gray-200)] cursor-pointer p-0.5" />
                      <input type="text" value={theme[field.key as keyof ThemeColors]} onChange={(e) => setTheme({ ...theme, [field.key]: e.target.value })} className="flex-1 px-3 py-2 bg-[var(--gray-100)] rounded-lg border border-[var(--gray-200)] text-xs font-mono outline-none focus:border-[#6C5CE7]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Preview</h3>
            <div className="rounded-xl p-6" style={{ background: theme.bg }}>
              <div className="flex gap-4 mb-4 flex-wrap">
                {[['Primary', theme.primary], ['Dark', theme.primary_dark], ['Accent', theme.accent], ['Success', theme.success]].map(([label, color]) => (
                  <div key={label} className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ background: color }}>{label}</div>
                ))}
              </div>
              <div className="rounded-lg p-4" style={{ background: theme.card }}>
                <p style={{ color: theme.text }} className="font-bold">Texto principal</p>
                <p style={{ color: theme.text_secondary }} className="text-sm">Texto secundario</p>
                <p style={{ color: theme.text_muted }} className="text-xs">Texto muted</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={resetTheme} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-[var(--gray-100)] text-[var(--text-secondary)] rounded-xl font-semibold hover:bg-[var(--gray-300)] transition-colors disabled:opacity-50">
              <RotateCcw size={16} /> Restaurar Padrao
            </button>
            <button onClick={async () => { setSaving(true); setMessage(null); try { await saveSetting('theme_colors', theme as unknown as Record<string, unknown>); const root = document.documentElement; for (const [key, value] of Object.entries(theme)) { const varName = themeVarMap[key]; if (varName) root.style.setProperty(varName, value) }; setMessage({ type: 'success', text: 'Tema salvo e aplicado!' }) } catch { setMessage({ type: 'error', text: 'Erro ao salvar tema' }) } finally { setSaving(false) } }} disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Salvando...' : 'Salvar Tema'}
            </button>
          </div>
        </div>
      )}

      {/* ===== TAB: LINKS & REDES ===== */}
      {tab === 'links' && (
        <div className="space-y-8">
          {/* WhatsApp */}
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
              <MessageCircle size={20} className="text-[#25D366]" /> WhatsApp
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Numero (com DDI + DDD)</label>
                <input type="text" value={links.whatsapp_number} onChange={(e) => setLinks({ ...links, whatsapp_number: e.target.value.replace(/\D/g, '') })} placeholder="5511999999999" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Mensagem padrao</label>
                <textarea value={links.whatsapp_message} onChange={(e) => setLinks({ ...links, whatsapp_message: e.target.value })} rows={2} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
              <Link2 size={20} className="text-[#6C5CE7]" /> Redes Sociais
            </h3>
            <div className="space-y-4">
              {[['Instagram', 'instagram_url'], ['Twitter / X', 'twitter_url'], ['YouTube', 'youtube_url']] .map(([label, key]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">{label}</label>
                  <input type="url" value={(links as unknown as Record<string, string>)[key] || ''} onChange={(e) => setLinks({ ...links, [key]: e.target.value })} className={inputClass} />
                </div>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Contato</h3>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">E-mail de contato</label>
              <input type="email" value={links.email} onChange={(e) => setLinks({ ...links, email: e.target.value })} className={inputClass} />
            </div>
          </div>

          {/* Footer Columns */}
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Colunas do Footer</h3>
            <div className="space-y-4">
              {footerConfig.columns.map((col, ci) => (
                <div key={ci} className="border border-[var(--gray-200)] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input type="text" value={col.title} placeholder="Titulo da coluna" onChange={(e) => { const columns = [...footerConfig.columns]; columns[ci] = { ...columns[ci], title: e.target.value }; setFooterConfig({ ...footerConfig, columns }) }} className={`${smallInputClass} flex-1`} />
                    <button onClick={() => setFooterConfig({ ...footerConfig, columns: footerConfig.columns.filter((_, idx) => idx !== ci) })} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                  <div className="space-y-1">
                    {col.links.map((link, li) => (
                      <div key={li} className="flex gap-2 items-center">
                        <input type="text" value={link.name} placeholder="Nome" onChange={(e) => { const columns = [...footerConfig.columns]; const links = [...columns[ci].links]; links[li] = { ...links[li], name: e.target.value }; columns[ci] = { ...columns[ci], links }; setFooterConfig({ ...footerConfig, columns }) }} className={`${smallInputClass} flex-1`} />
                        <input type="text" value={link.href} placeholder="/pagina" onChange={(e) => { const columns = [...footerConfig.columns]; const links = [...columns[ci].links]; links[li] = { ...links[li], href: e.target.value }; columns[ci] = { ...columns[ci], links }; setFooterConfig({ ...footerConfig, columns }) }} className={`${smallInputClass} flex-1`} />
                        <button onClick={() => { const columns = [...footerConfig.columns]; columns[ci] = { ...columns[ci], links: columns[ci].links.filter((_, idx) => idx !== li) }; setFooterConfig({ ...footerConfig, columns }) }} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                      </div>
                    ))}
                    <button onClick={() => { const columns = [...footerConfig.columns]; columns[ci] = { ...columns[ci], links: [...columns[ci].links, { name: '', href: '' }] }; setFooterConfig({ ...footerConfig, columns }) }} className="text-xs text-[#6C5CE7] font-semibold flex items-center gap-1"><Plus size={10} /> Link</button>
                  </div>
                </div>
              ))}
              <button onClick={() => setFooterConfig({ ...footerConfig, columns: [...footerConfig.columns, { title: '', links: [] }] })} className="text-xs text-[#6C5CE7] font-semibold flex items-center gap-1"><Plus size={12} /> Adicionar coluna</button>
            </div>
          </div>

          {/* Metodos de Pagamento */}
          <div className="bg-[var(--card)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4">Metodos de Pagamento (footer)</h3>
            <div className="flex flex-wrap gap-2">
              {footerConfig.payment_methods.map((m, i) => (
                <div key={i} className="flex items-center gap-1 bg-[var(--gray-100)] rounded-lg px-3 py-1.5">
                  <input type="text" value={m} onChange={(e) => { const methods = [...footerConfig.payment_methods]; methods[i] = e.target.value; setFooterConfig({ ...footerConfig, payment_methods: methods }) }} className="bg-transparent text-sm outline-none w-16" />
                  <button onClick={() => setFooterConfig({ ...footerConfig, payment_methods: footerConfig.payment_methods.filter((_, idx) => idx !== i) })} className="text-red-400 hover:text-red-600"><X size={12} /></button>
                </div>
              ))}
              <button onClick={() => setFooterConfig({ ...footerConfig, payment_methods: [...footerConfig.payment_methods, ''] })} className="text-xs text-[#6C5CE7] font-semibold flex items-center gap-1 px-3 py-1.5"><Plus size={12} /> Adicionar</button>
            </div>
          </div>

          <button onClick={() => saveWith([['site_links', links], ['footer_config', footerConfig]])} disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Salvando...' : 'Salvar Links & Footer'}
          </button>
        </div>
      )}
    </div>
  )
}
