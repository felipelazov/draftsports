import { createClient } from '@supabase/supabase-js'
import type { Product, Team, Order, OrderItem, SiteSetting } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function getProducts() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Product[]
}

export async function getProduct(id: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Product
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data as Product
}

export async function getFeaturedProducts() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Product[]
}

export async function getNewArrivals(limit = 8) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Product[]
}

export async function getRelatedProducts(league: string, excludeId: string, limit = 6) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('league', league)
    .neq('id', excludeId)
    .limit(limit)

  if (error) throw error
  return data as Product[]
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at'>) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(product)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

export async function updateProduct(id: string, product: Partial<Omit<Product, 'id' | 'created_at'>>) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Teams CRUD

export async function getTeams(league?: string) {
  let query = supabaseAdmin
    .from('teams')
    .select('*')
    .order('league')
    .order('name')

  if (league) {
    query = query.eq('league', league)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Team[]
}

export async function getTeam(id: string) {
  const { data, error } = await supabaseAdmin
    .from('teams')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Team
}

export async function createTeam(team: Omit<Team, 'id' | 'created_at'>) {
  const { data, error } = await supabaseAdmin
    .from('teams')
    .insert(team)
    .select()
    .single()

  if (error) throw error
  return data as Team
}

export async function updateTeam(id: string, team: Partial<Omit<Team, 'id' | 'created_at'>>) {
  const { data, error } = await supabaseAdmin
    .from('teams')
    .update(team)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Team
}

export async function deleteTeam(id: string) {
  const { error } = await supabaseAdmin
    .from('teams')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Orders CRUD

export async function getOrders(status?: string) {
  let query = supabaseAdmin
    .from('orders')
    .select('*, order_items(*, products(*))')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw error
  return data as (Order & { order_items: (OrderItem & { products: Product })[] })[]
}

export async function getOrder(id: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Order & { order_items: (OrderItem & { products: Product })[] }
}

export async function getOrdersByUser(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as (Order & { order_items: (OrderItem & { products: Product })[] })[]
}

export async function createOrder(
  order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'items' | 'tracking_code' | 'tracking_url'>,
  items: Omit<OrderItem, 'id' | 'order_id' | 'created_at' | 'product'>[]
) {
  const { data: orderData, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert(order)
    .select()
    .single()

  if (orderError) throw orderError

  const orderItems = items.map((item) => ({
    ...item,
    order_id: orderData.id,
  }))

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError

  return orderData as Order
}

export async function updateOrder(id: string, updates: Partial<Pick<Order, 'status' | 'tracking_code' | 'tracking_url' | 'payment_id'>>) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Order
}

export async function deleteOrder(id: string) {
  const { error } = await supabaseAdmin
    .from('orders')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Site Settings CRUD

export async function getSettings() {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('*')

  if (error) throw error
  return data as SiteSetting[]
}

export async function getSetting(key: string) {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('*')
    .eq('setting_key', key)
    .single()

  if (error) throw error
  return data as SiteSetting
}

export async function updateSetting(key: string, value: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .upsert(
      { setting_key: key, setting_value: value },
      { onConflict: 'setting_key' }
    )
    .select()
    .single()

  if (error) throw error
  return data as SiteSetting
}
