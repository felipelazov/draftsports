import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getProduct, updateProduct, deleteProduct } from '@/lib/supabase-admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await getProduct(id)
    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const product = await updateProduct(id, body)
    revalidatePath('/')
    revalidatePath('/catalogo')
    revalidatePath('/nba')
    revalidatePath('/nfl')
    revalidatePath('/mlb')
    revalidatePath('/nhl')
    revalidatePath('/futebol')
    revalidatePath(`/produto/${product.slug}`)
    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteProduct(id)
    revalidatePath('/')
    revalidatePath('/catalogo')
    revalidatePath('/nba')
    revalidatePath('/nfl')
    revalidatePath('/mlb')
    revalidatePath('/nhl')
    revalidatePath('/futebol')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 })
  }
}
