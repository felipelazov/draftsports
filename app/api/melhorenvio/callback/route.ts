import { NextRequest, NextResponse } from 'next/server'
import { exchangeCode } from '@/lib/melhorenvio'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Codigo de autorizacao nao fornecido' }, { status: 400 })
  }

  try {
    await exchangeCode(code)
    return NextResponse.json({
      success: true,
      message: 'Melhor Envio conectado com sucesso! Token salvo no banco de dados.',
    })
  } catch (error) {
    console.error('Melhor Envio callback error:', error)
    return NextResponse.json({
      success: false,
      error: 'Falha ao conectar Melhor Envio',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    }, { status: 500 })
  }
}
