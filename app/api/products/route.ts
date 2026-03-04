import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const league = searchParams.get('league')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'popular'
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    let products = await getProducts()

    if (league) {
      products = products.filter((p) => p.league === league.toUpperCase())
    }

    if (featured === 'true') {
      products = products.filter((p) => p.featured)
    }

    if (search) {
      const q = search.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.team.toLowerCase().includes(q) ||
          (p.player && p.player.toLowerCase().includes(q))
      )
    }

    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        products.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        products.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
      case 'popular':
        products.sort((a, b) => b.review_count - a.review_count)
        break
    }

    if (limit) {
      products = products.slice(0, parseInt(limit))
    }

    return NextResponse.json({ products, total: products.length })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ products: [], total: 0 })
  }
}
