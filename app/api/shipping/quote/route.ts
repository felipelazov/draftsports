import { NextRequest, NextResponse } from 'next/server'
import { calculateShipping } from '@/lib/melhorenvio'

export async function POST(request: NextRequest) {
  try {
    const { cep, items } = await request.json()

    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      return NextResponse.json({ error: 'CEP invalido' }, { status: 400 })
    }

    // Default product dimensions for jerseys/shorts
    const products = items?.length
      ? items.map((item: { quantity?: number }) => ({
          width: 20,
          height: 5,
          length: 30,
          weight: 0.3,
          quantity: item.quantity || 1,
        }))
      : [{ width: 20, height: 5, length: 30, weight: 0.3, quantity: 1 }]

    const quotes = await calculateShipping(cep, products)

    return NextResponse.json({
      quotes: quotes.map(q => ({
        id: q.id,
        name: q.name,
        company: q.company.name,
        logo: q.company.picture,
        price: parseFloat(q.price),
        discount: parseFloat(q.discount || '0'),
        days: q.delivery_time,
        deliveryRange: q.delivery_range,
      })),
    })
  } catch (error) {
    console.error('Shipping quote error:', error)

    // Fallback to static calculation if Melhor Envio is not connected
    const { cep } = await request.clone().json().catch(() => ({ cep: '' }))
    const cleanCep = (cep || '').replace(/\D/g, '')
    const region = parseInt(cleanCep.substring(0, 1))

    const fallbackRegions = [
      { start: 0, end: 1, price: 0, days: 5, name: 'SP' },
      { start: 2, end: 3, price: 14.90, days: 7, name: 'RJ/MG/ES' },
      { start: 4, end: 5, price: 24.90, days: 10, name: 'Sul/Centro-Oeste' },
      { start: 6, end: 9, price: 34.90, days: 12, name: 'Norte/Nordeste' },
    ]

    const matched = fallbackRegions.find(r => region >= r.start && region <= r.end)
    const price = matched?.price ?? 29.90
    const days = matched?.days ?? 10

    return NextResponse.json({
      quotes: [{
        id: 0,
        name: 'Envio Padrao',
        company: 'Draft Sports',
        logo: null,
        price,
        discount: 0,
        days,
        deliveryRange: { min: days - 2, max: days },
      }],
      fallback: true,
    })
  }
}
