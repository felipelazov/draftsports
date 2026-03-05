export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  original_price: number | null
  images: string[]
  league: League
  team: string
  player: string | null
  type: ProductType
  sizes: Size[]
  colors: string[]
  stock: number
  cost: number | null
  player_number: string | null
  stock_per_size: StockPerSize
  primary_color: string | null
  secondary_color: string | null
  featured: boolean
  video_url: string | null
  rating: number
  review_count: number
  created_at: string
}

export type League = 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'FUTEBOL' | 'RETRO' | 'ACESSORIOS'

export type ProductType = 'titular' | 'reserva' | 'retro' | 'especial'

export type Size = 'P' | 'M' | 'G' | 'GG' | 'XGG'

export type StockPerSize = Partial<Record<Size, number>>

export type OrderStatus = 'pendente' | 'pago' | 'enviado' | 'entregue'

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total: number
  payment_method: 'pix' | 'cartao'
  payment_id: string | null
  tracking_code: string | null
  tracking_url: string | null
  shipping_address: ShippingAddress
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface SiteSetting {
  id: string
  setting_key: string
  setting_value: Record<string, unknown>
  updated_at: string
}

export interface HeroBanner {
  title: string
  subtitle: string
  cta_text: string
  cta_link: string
  background_image: string | null
  card_media: string | null
  card_media_type: 'image' | 'video' | null
  badge_text: string
  secondary_cta_text: string
  secondary_cta_link: string
  stats: { value: string; label: string }[]
}

export interface PromoBanner {
  title: string
  subtitle: string
  badge_text: string
  cta_text: string
  cta_link: string
  background_image: string | null
}

export interface ThemeColors {
  primary: string
  primary_dark: string
  primary_light: string
  accent: string
  success: string
  warning: string
  info: string
  bg: string
  bg_elevated: string
  bg_sunken: string
  card: string
  text: string
  text_secondary: string
  text_muted: string
}

export interface SiteLinks {
  whatsapp_number: string
  whatsapp_message: string
  instagram_url: string
  twitter_url: string
  youtube_url: string
  email: string
}

export interface StoreInfo {
  name: string
  description: string
  copyright: string
}

export interface HomepageSections {
  categories_title: string
  categories_subtitle: string
  featured_title: string
  featured_subtitle: string
  live_title: string
  live_subtitle: string
  new_arrivals_title: string
  new_arrivals_subtitle: string
  new_arrivals_cta: string
}

export interface HomepageFeature {
  icon: string
  title: string
  description: string
}

export interface HomepageFeatures {
  items: HomepageFeature[]
}

export interface NewsletterConfig {
  title: string
  subtitle: string
  button_text: string
}

export interface ProductBenefit {
  icon: string
  title: string
  subtitle: string
}

export interface ProductConfig {
  benefits: ProductBenefit[]
  installments: number
  out_of_stock_title: string
  out_of_stock_message: string
}

export interface ShippingRegion {
  name: string
  cep_start: number
  cep_end: number
  price: number
  days: number
}

export interface Coupon {
  code: string
  type: 'percent' | 'fixed'
  value: number
  active: boolean
}

export interface SecuritySeal {
  icon: string
  text: string
}

export interface CheckoutConfig {
  pix_discount_percent: number
  free_shipping_min: number
  shipping_regions: ShippingRegion[]
  coupons: Coupon[]
  security_seals: SecuritySeal[]
}

export interface FooterColumn {
  title: string
  links: { name: string; href: string }[]
}

export interface FooterConfig {
  columns: FooterColumn[]
  payment_methods: string[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  size: Size
  price: number
}

export interface ShippingAddress {
  name: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zip: string
}

export interface CartItem {
  product: Product
  quantity: number
  size: Size
}

export interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment: string
  created_at: string
  user_name?: string
}

export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface FilterState {
  league: League | null
  team: string | null
  priceRange: [number, number]
  sizes: Size[]
  type: ProductType | null
  rating: number | null
  search: string
  sort: 'price-asc' | 'price-desc' | 'newest' | 'popular'
}

export interface LeagueInfo {
  id: League
  name: string
  icon: string
  color: string
  description: string
}

export interface Team {
  id: string
  name: string
  abbreviation: string
  league: string
  city: string
  primary_color: string
  created_at: string
}
