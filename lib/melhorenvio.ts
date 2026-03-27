import { supabaseAdmin } from './supabase-admin'

const BASE_URL = 'https://www.melhorenvio.com.br'
const SETTING_KEY = 'melhorenvio_tokens'

interface MelhorEnvioTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

interface StoredToken {
  access_token: string
  refresh_token: string
  expires_at: number
}

// In-memory cache to avoid DB hits on every request
let cachedToken: StoredToken | null = null

export function getAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.MELHORENVIO_CLIENT_ID!,
    redirect_uri: process.env.MELHORENVIO_REDIRECT_URI!,
    response_type: 'code',
    scope: 'shipping-calculate shipping-cancel shipping-checkout shipping-companies shipping-generate shipping-preview shipping-print shipping-share shipping-tracking',
    state: 'draftsports',
  })
  return `${BASE_URL}/oauth/authorize?${params.toString()}`
}

async function saveTokenToDb(token: StoredToken): Promise<void> {
  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert({
      setting_key: SETTING_KEY,
      setting_value: token,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'setting_key' })

  if (error) console.error('Failed to save Melhor Envio token:', error)
}

async function loadTokenFromDb(): Promise<StoredToken | null> {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('setting_value')
    .eq('setting_key', SETTING_KEY)
    .single()

  if (error || !data) return null
  const val = data.setting_value as unknown as StoredToken
  if (!val?.access_token) return null
  return val
}

export async function exchangeCode(code: string): Promise<MelhorEnvioTokens> {
  const res = await fetch(`${BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.MELHORENVIO_CLIENT_ID!,
      client_secret: process.env.MELHORENVIO_CLIENT_SECRET!,
      redirect_uri: process.env.MELHORENVIO_REDIRECT_URI!,
      code,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Melhor Envio OAuth error: ${err}`)
  }

  const data = await res.json()
  const token: StoredToken = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  }

  cachedToken = token
  await saveTokenToDb(token)

  return data
}

async function refreshToken(current: StoredToken): Promise<StoredToken> {
  const res = await fetch(`${BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: process.env.MELHORENVIO_CLIENT_ID!,
      client_secret: process.env.MELHORENVIO_CLIENT_SECRET!,
      refresh_token: current.refresh_token,
    }),
  })

  if (!res.ok) throw new Error('Failed to refresh Melhor Envio token')

  const data = await res.json()
  const token: StoredToken = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  }

  cachedToken = token
  await saveTokenToDb(token)

  return token
}

export async function getAccessToken(): Promise<string | null> {
  // 1. Check memory cache
  if (!cachedToken) {
    // 2. Check database
    cachedToken = await loadTokenFromDb()
  }

  if (!cachedToken) {
    // 3. Check env fallback
    if (process.env.MELHORENVIO_ACCESS_TOKEN) {
      return process.env.MELHORENVIO_ACCESS_TOKEN
    }
    return null
  }

  // Refresh if expiring in less than 5 minutes
  if (cachedToken.expires_at - Date.now() < 5 * 60 * 1000) {
    try {
      cachedToken = await refreshToken(cachedToken)
    } catch {
      // If refresh fails, clear cache and return null
      cachedToken = null
      return null
    }
  }

  return cachedToken.access_token
}

export interface ShippingQuote {
  id: number
  name: string
  company: { name: string; picture: string }
  price: string
  discount: string
  currency: string
  delivery_time: number
  delivery_range: { min: number; max: number }
  custom_price: string
  error?: string
}

export async function calculateShipping(
  cepDestino: string,
  products: { width: number; height: number; length: number; weight: number; quantity: number }[]
): Promise<ShippingQuote[]> {
  const token = await getAccessToken()
  if (!token) throw new Error('Melhor Envio nao autorizado. Acesse /api/melhorenvio/auth para conectar.')

  const res = await fetch(`${BASE_URL}/api/v2/me/shipment/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'Draft Sports (cffn.shop@gmail.com)',
    },
    body: JSON.stringify({
      from: { postal_code: process.env.MELHORENVIO_CEP_ORIGEM || '15013110' },
      to: { postal_code: cepDestino.replace(/\D/g, '') },
      products: products.map(p => ({
        width: p.width || 20,
        height: p.height || 5,
        length: p.length || 30,
        weight: p.weight || 0.3,
        quantity: p.quantity || 1,
      })),
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Erro ao calcular frete: ${err}`)
  }

  const data: ShippingQuote[] = await res.json()
  return data.filter(q => !q.error && parseFloat(q.price) > 0)
}
