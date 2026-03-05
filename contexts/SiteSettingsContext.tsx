'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type {
  SiteLinks,
  ThemeColors,
  StoreInfo,
  HomepageSections,
  HomepageFeatures,
  NewsletterConfig,
  ProductConfig,
  CheckoutConfig,
  FooterConfig,
} from '@/types'

const defaultLinks: SiteLinks = {
  whatsapp_number: '5511999999999',
  whatsapp_message: 'Olá! Vim pelo site DRAFT e gostaria de mais informações.',
  instagram_url: '',
  twitter_url: '',
  youtube_url: '',
  email: 'contato@draftsports.com.br',
}

const defaultStoreInfo: StoreInfo = {
  name: 'DRAFT',
  description: 'A melhor loja de camisas esportivas americanas do Brasil. Autenticidade e estilo em cada peça.',
  copyright: '© 2026 DRAFT. Todos os direitos reservados.',
}

const defaultSections: HomepageSections = {
  categories_title: 'Escolha sua liga',
  categories_subtitle: 'As maiores ligas esportivas do mundo em um só lugar',
  featured_title: 'Destaques da semana',
  featured_subtitle: 'Os produtos mais populares escolhidos para você',
  live_title: 'Jogos ao Vivo',
  live_subtitle: 'Acompanhe os jogos de hoje e vista a camisa do seu time',
  new_arrivals_title: 'Novos lançamentos',
  new_arrivals_subtitle: 'As últimas camisas que acabaram de chegar',
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
  title: 'Receba ofertas exclusivas',
  subtitle: 'Cadastre-se e ganhe 10% de desconto na primeira compra',
  button_text: 'Inscrever',
}

const defaultProductConfig: ProductConfig = {
  benefits: [
    { icon: 'Truck', title: 'Frete Gratis', subtitle: 'Acima de R$ 299' },
    { icon: 'Shield', title: '100% Original', subtitle: 'Garantia total' },
    { icon: 'RotateCcw', title: 'Troca Facil', subtitle: 'Ate 30 dias' },
  ],
  installments: 3,
  out_of_stock_title: 'Produto esgotado',
  out_of_stock_message: 'Deixe seu e-mail e avisaremos quando este produto voltar.',
}

const defaultCheckoutConfig: CheckoutConfig = {
  pix_discount_percent: 5,
  free_shipping_min: 299,
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
    {
      title: 'Ligas',
      links: [
        { name: 'NBA', href: '/catalogo/nba' },
        { name: 'NFL', href: '/catalogo/nfl' },
        { name: 'MLB', href: '/catalogo/mlb' },
        { name: 'NHL', href: '/catalogo/nhl' },
        { name: 'Futebol', href: '/catalogo/futebol' },
      ],
    },
    {
      title: 'Institucional',
      links: [
        { name: 'Sobre Nós', href: '/sobre' },
        { name: 'Política de Privacidade', href: '/privacidade' },
        { name: 'Termos de Uso', href: '/termos' },
        { name: 'Trocas e Devoluções', href: '/trocas' },
      ],
    },
    {
      title: 'Ajuda',
      links: [
        { name: 'Perguntas Frequentes', href: '/faq' },
        { name: 'Rastrear Pedido', href: '/conta/pedidos' },
        { name: 'Guia de Tamanhos', href: '/tamanhos' },
        { name: 'Contato', href: '/contato' },
      ],
    },
  ],
  payment_methods: ['PIX', 'Visa', 'Master', 'Amex'],
}

const themeVarMap: Record<string, string> = {
  primary: '--primary',
  primary_dark: '--primary-dark',
  primary_light: '--primary-light',
  accent: '--accent',
  success: '--success',
  warning: '--warning',
  info: '--info',
  bg: '--bg',
  bg_elevated: '--bg-elevated',
  bg_sunken: '--bg-sunken',
  card: '--card',
  text: '--text',
  text_secondary: '--text-secondary',
  text_muted: '--text-muted',
}

interface SiteSettingsContextType {
  links: SiteLinks
  storeInfo: StoreInfo
  sections: HomepageSections
  features: HomepageFeatures
  newsletter: NewsletterConfig
  productConfig: ProductConfig
  checkoutConfig: CheckoutConfig
  footerConfig: FooterConfig
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  links: defaultLinks,
  storeInfo: defaultStoreInfo,
  sections: defaultSections,
  features: defaultFeatures,
  newsletter: defaultNewsletter,
  productConfig: defaultProductConfig,
  checkoutConfig: defaultCheckoutConfig,
  footerConfig: defaultFooterConfig,
})

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [links, setLinks] = useState<SiteLinks>(defaultLinks)
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(defaultStoreInfo)
  const [sections, setSections] = useState<HomepageSections>(defaultSections)
  const [features, setFeatures] = useState<HomepageFeatures>(defaultFeatures)
  const [newsletter, setNewsletter] = useState<NewsletterConfig>(defaultNewsletter)
  const [productConfig, setProductConfig] = useState<ProductConfig>(defaultProductConfig)
  const [checkoutConfig, setCheckoutConfig] = useState<CheckoutConfig>(defaultCheckoutConfig)
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(defaultFooterConfig)

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.links) setLinks({ ...defaultLinks, ...data.links })
        if (data.store_info) setStoreInfo({ ...defaultStoreInfo, ...data.store_info })
        if (data.homepage_sections) setSections({ ...defaultSections, ...data.homepage_sections })
        if (data.homepage_features) setFeatures({ ...defaultFeatures, ...data.homepage_features })
        if (data.newsletter) setNewsletter({ ...defaultNewsletter, ...data.newsletter })
        if (data.product_config) setProductConfig({ ...defaultProductConfig, ...data.product_config })
        if (data.checkout_config) setCheckoutConfig({ ...defaultCheckoutConfig, ...data.checkout_config })
        if (data.footer_config) setFooterConfig({ ...defaultFooterConfig, ...data.footer_config })
        if (data.theme) {
          const root = document.documentElement
          for (const [key, value] of Object.entries(data.theme)) {
            const varName = themeVarMap[key]
            if (varName && typeof value === 'string') {
              root.style.setProperty(varName, value)
            }
          }
        }
      })
      .catch(() => {})
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ links, storeInfo, sections, features, newsletter, productConfig, checkoutConfig, footerConfig }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}
