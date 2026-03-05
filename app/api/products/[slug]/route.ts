import { NextResponse } from 'next/server'
import { getProductBySlug, getRelatedProducts } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    const related = await getRelatedProducts(product.league, product.id)

    return NextResponse.json(
      { product, related },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  } catch {
    return NextResponse.json(
      { error: 'Produto nao encontrado' },
      { status: 404, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  }
}
