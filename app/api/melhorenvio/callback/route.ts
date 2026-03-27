import { NextRequest, NextResponse } from 'next/server'
import { exchangeCode } from '@/lib/melhorenvio'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Codigo de autorizacao nao fornecido' }, { status: 400 })
  }

  try {
    const tokens = await exchangeCode(code)
    // Redirect to admin with success message
    const url = new URL('/admin/configuracoes', request.url)
    url.searchParams.set('melhorenvio', 'connected')
    url.searchParams.set('token_preview', tokens.access_token.substring(0, 20) + '...')
    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Melhor Envio callback error:', error)
    const url = new URL('/admin/configuracoes', request.url)
    url.searchParams.set('melhorenvio', 'error')
    return NextResponse.redirect(url)
  }
}
