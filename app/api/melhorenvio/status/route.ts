import { NextResponse } from 'next/server'
import { getAccessToken } from '@/lib/melhorenvio'

export async function GET() {
  try {
    const token = await getAccessToken()
    if (token) {
      return NextResponse.json({
        connected: true,
        message: 'Melhor Envio conectado e funcionando',
        token_preview: token.substring(0, 15) + '...',
      })
    }
    return NextResponse.json({
      connected: false,
      message: 'Melhor Envio nao conectado. Acesse /api/melhorenvio/auth para autorizar.',
    })
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    })
  }
}
