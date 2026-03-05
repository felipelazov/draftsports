import { NextResponse } from 'next/server'

// All sports via ESPN public API — no API key needed

const SPORTS: Record<string, string> = {
  nba:     'basketball/nba',
  nfl:     'football/nfl',
  mlb:     'baseball/mlb',
  nhl:     'hockey/nhl',
  futebol: 'soccer/bra.1',
}

const SOCCER_LEAGUES: Record<string, string> = {
  'brasileirao':       'soccer/bra.1',
  'champions-league':  'soccer/uefa.champions',
  'premier-league':    'soccer/eng.1',
  'la-liga':           'soccer/esp.1',
  'serie-a':           'soccer/ita.1',
  'bundesliga':        'soccer/ger.1',
  'ligue-1':           'soccer/fra.1',
  'mls':               'soccer/usa.1',
  'libertadores':      'soccer/conmebol.libertadores',
  'copa-do-brasil':    'soccer/bra.copa_do_brasil',
}

export const revalidate = 60

interface ESPNCompetitor {
  homeAway: string
  team: {
    id: string
    name: string
    abbreviation: string
    displayName: string
    shortDisplayName: string
    logo: string
  }
  score: string
}

interface ESPNBroadcast {
  market: string
  names: string[]
}

interface ESPNEvent {
  id: string
  date: string
  name: string
  shortName: string
  status: {
    type: {
      detail: string
      shortDetail: string
      state: string
    }
  }
  competitions: Array<{
    competitors: ESPNCompetitor[]
    broadcasts?: ESPNBroadcast[]
  }>
}

function formatBRT(isoDate: string): { time: string; weekday: string } {
  const d = new Date(isoDate)
  const time = d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
  const weekday = d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    timeZone: 'America/Sao_Paulo',
  })
  return { time, weekday }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sport = searchParams.get('sport') || 'nba'
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const league = searchParams.get('league') || undefined

    const basePath = SPORTS[sport]
    if (!basePath) {
      return NextResponse.json(
        { error: `Esporte "${sport}" nao suportado` },
        { status: 400 }
      )
    }

    // For soccer, allow sub-league selection
    const path = sport === 'futebol' && league && SOCCER_LEAGUES[league]
      ? SOCCER_LEAGUES[league]
      : basePath

    const espnDate = date.replace(/-/g, '')
    const url = `https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?dates=${espnDate}`

    const res = await fetch(url, { next: { revalidate: 60 } })

    if (!res.ok) {
      console.error('ESPN API error:', res.status, url)
      return NextResponse.json(
        { error: 'Erro ao buscar jogos' },
        { status: res.status }
      )
    }

    const json = await res.json()
    const events: ESPNEvent[] = json.events || []

    const games = events.map((event) => {
      const comp = event.competitions[0]
      const home = comp.competitors.find((c) => c.homeAway === 'home')
      const away = comp.competitors.find((c) => c.homeAway === 'away')

      let status: 'scheduled' | 'live' | 'final' = 'scheduled'
      if (event.status.type.state === 'in') status = 'live'
      else if (event.status.type.state === 'post') status = 'final'

      const { time, weekday } = formatBRT(event.date)

      // Collect broadcast names
      const broadcasts = comp.broadcasts || []
      const channels: string[] = []
      for (const b of broadcasts) {
        for (const name of b.names) {
          if (!channels.includes(name)) channels.push(name)
        }
      }

      return {
        id: event.id,
        date: event.date,
        name: event.shortName,
        status,
        statusDetail: event.status.type.shortDetail,
        timeBRT: time,
        weekday,
        broadcasts: channels,
        homeTeam: {
          name: home?.team.shortDisplayName || home?.team.name || '',
          fullName: home?.team.displayName || '',
          abbreviation: home?.team.abbreviation || '',
          logo: home?.team.logo || '',
          score: home?.score || '0',
        },
        awayTeam: {
          name: away?.team.shortDisplayName || away?.team.name || '',
          fullName: away?.team.displayName || '',
          abbreviation: away?.team.abbreviation || '',
          logo: away?.team.logo || '',
          score: away?.score || '0',
        },
      }
    })

    return NextResponse.json({
      data: games,
      date,
      sport,
      league: league || null,
    })
  } catch (error) {
    console.error('Error fetching sports schedule:', error)
    return NextResponse.json(
      { error: 'Erro interno ao buscar jogos' },
      { status: 500 }
    )
  }
}
