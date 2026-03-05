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
  featured: boolean
  video_url: string | null
  rating: number
  review_count: number
  created_at: string
}

export type League = 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'FUTEBOL' | 'RETRO' | 'ACESSORIOS'

export type ProductType = 'titular' | 'reserva' | 'retro' | 'especial'

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL'

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
