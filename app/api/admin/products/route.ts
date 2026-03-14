import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getProducts, createProduct } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = await createProduct(body)
    revalidatePath('/')
    revalidatePath('/catalogo')
    revalidatePath('/nba')
    revalidatePath('/nfl')
    revalidatePath('/mlb')
    revalidatePath('/nhl')
    revalidatePath('/futebol')
    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    const message = error instanceof Error ? error.message : 'Erro ao criar produto'
    const isDuplicate = message.includes('duplicate') || message.includes('unique') || message.includes('23505')
    return NextResponse.json({
      error: isDuplicate
        ? 'Ja existe um produto com este slug. Altere o nome ou os dados para gerar um slug unico.'
        : message,
    }, { status: isDuplicate ? 409 : 500 })
  }
}
