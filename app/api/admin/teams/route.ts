import { NextRequest, NextResponse } from 'next/server'
import { getTeams, createTeam } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const league = request.nextUrl.searchParams.get('league') || undefined
    const teams = await getTeams(league)
    return NextResponse.json({ teams })
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json({ error: 'Erro ao buscar times' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const team = await createTeam(body)
    return NextResponse.json({ team }, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json({ error: 'Erro ao criar time' }, { status: 500 })
  }
}
