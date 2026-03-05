import { NextResponse } from 'next/server'

// ── Sport Configuration ─────────────────────────────────────────────
// BallDontLie: NBA, NFL, MLB (clean team objects, quarter scores)
// ESPN: NHL, Soccer (logos, all leagues, Brasileirão)

interface SportConfig {
  source: 'balldontlie' | 'espn'
  path: string        // BallDontLie: API path prefix | ESPN: sport/league
  leagueParam?: string // for soccer sub-leagues
}

const SPORTS: Record<string, SportConfig> = {
  // BallDontLie sports
  nba:     { source: 'balldontlie', path: '' },
  nfl:     { source: 'balldontlie', path: 'nfl/' },
  mlb:     { source: 'balldontlie', path: 'mlb/' },
  // ESPN sports
  nhl:     { source: 'espn', path: 'hockey/nhl' },
  futebol: { source: 'espn', path: 'soccer/bra.1' },
}

// Soccer sub-leagues (ESPN)
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

// ── Normalized Game Output ──────────────────────────────────────────
interface GameOutput {
  id: string
  date: string
  name: string
  status: 'scheduled' | 'live' | 'final'
  statusDetail: string
  homeTeam: TeamOutput
  awayTeam: TeamOutput
}

interface TeamOutput {
  name: string
  fullName: string
  abbreviation: string
  logo: string
  score: string
}

// ── BallDontLie Fetcher ─────────────────────────────────────────────

interface BDLTeam {
  id: number
  name: string
  full_name?: string
  display_name?: string
  short_display_name?: string
  abbreviation: string
  city?: string
  location?: string
  conference?: string
  division?: string
  league?: string
  slug?: string
}

interface BDLNBAGame {
  id: number
  date: string
  status: string
  period: number
  time: string | null
  postseason: boolean
  home_team: BDLTeam
  visitor_team: BDLTeam
  home_team_score: number
  visitor_team_score: number
}

interface BDLMLBGame {
  id: number
  date: string
  status: string
  period: number
  home_team: BDLTeam
  away_team: BDLTeam
  home_team_name: string
  away_team_name: string
  home_team_data: { runs: number; hits: number; errors: number }
  away_team_data: { runs: number; hits: number; errors: number }
}

function parseBDLStatus(status: string, sportPath: string): { status: GameOutput['status']; detail: string } {
  // NBA/NFL: "Final", "1st Qtr", "Halftime", or ISO datetime for scheduled
  // MLB: "STATUS_FINAL", "STATUS_IN_PROGRESS", "STATUS_SCHEDULED"
  if (sportPath === 'mlb/') {
    if (status === 'STATUS_FINAL') return { status: 'final', detail: 'Final' }
    if (status === 'STATUS_IN_PROGRESS') return { status: 'live', detail: 'Em andamento' }
    if (status === 'STATUS_SCHEDULED') return { status: 'scheduled', detail: 'Agendado' }
    if (status.startsWith('STATUS_')) return { status: 'scheduled', detail: status.replace('STATUS_', '') }
    return { status: 'scheduled', detail: status }
  }

  // NBA/NFL
  if (status === 'Final') return { status: 'final', detail: 'Final' }
  const liveStatuses = ['1st Qtr', '2nd Qtr', '3rd Qtr', '4th Qtr', 'Halftime', 'OT',
    '1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter', 'Half']
  if (liveStatuses.some(s => status.includes(s))) return { status: 'live', detail: status }

  // Scheduled — status is usually an ISO datetime
  if (status.includes('T') && status.includes(':')) {
    const d = new Date(status)
    return {
      status: 'scheduled',
      detail: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }),
    }
  }

  return { status: 'scheduled', detail: status }
}

async function fetchBallDontLie(config: SportConfig, date: string): Promise<GameOutput[]> {
  const apiKey = process.env.BALLDONTLIE_API_KEY
  if (!apiKey) throw new Error('BALLDONTLIE_API_KEY nao configurada')

  const url = `https://api.balldontlie.io/${config.path}v1/games?dates[]=${date}`
  const res = await fetch(url, {
    headers: { Authorization: apiKey },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    console.error('BallDontLie error:', res.status, await res.text())
    throw new Error('Erro ao buscar jogos')
  }

  const json = await res.json()
  const data = json.data || []

  if (config.path === 'mlb/') {
    return data.map((game: BDLMLBGame) => {
      const parsed = parseBDLStatus(game.status, config.path)
      return {
        id: String(game.id),
        date: game.date,
        name: `${game.away_team?.abbreviation || ''} @ ${game.home_team?.abbreviation || ''}`,
        ...parsed,
        homeTeam: {
          name: game.home_team?.short_display_name || game.home_team?.name || game.home_team_name || '',
          fullName: game.home_team?.display_name || game.home_team_name || '',
          abbreviation: game.home_team?.abbreviation || '',
          logo: '',
          score: String(game.home_team_data?.runs ?? 0),
        },
        awayTeam: {
          name: game.away_team?.short_display_name || game.away_team?.name || game.away_team_name || '',
          fullName: game.away_team?.display_name || game.away_team_name || '',
          abbreviation: game.away_team?.abbreviation || '',
          logo: '',
          score: String(game.away_team_data?.runs ?? 0),
        },
      }
    })
  }

  // NBA / NFL — same structure
  return data.map((game: BDLNBAGame) => {
    const parsed = parseBDLStatus(game.status, config.path)
    const home = game.home_team
    const visitor = game.visitor_team
    return {
      id: String(game.id),
      date: game.date,
      name: `${visitor.abbreviation} @ ${home.abbreviation}`,
      ...parsed,
      homeTeam: {
        name: home.name,
        fullName: home.full_name || `${home.city || home.location || ''} ${home.name}`,
        abbreviation: home.abbreviation,
        logo: '',
        score: String(game.home_team_score ?? 0),
      },
      awayTeam: {
        name: visitor.name,
        fullName: visitor.full_name || `${visitor.city || visitor.location || ''} ${visitor.name}`,
        abbreviation: visitor.abbreviation,
        logo: '',
        score: String(game.visitor_team_score ?? 0),
      },
    }
  })
}

// ── ESPN Fetcher ────────────────────────────────────────────────────

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

interface ESPNEvent {
  id: string
  date: string
  name: string
  shortName: string
  status: {
    type: {
      name: string
      description: string
      detail: string
      shortDetail: string
      state: string
    }
  }
  competitions: Array<{ competitors: ESPNCompetitor[] }>
}

async function fetchESPN(config: SportConfig, date: string, league?: string): Promise<GameOutput[]> {
  const path = league && SOCCER_LEAGUES[league] ? SOCCER_LEAGUES[league] : config.path
  const espnDate = date.replace(/-/g, '')
  const url = `https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?dates=${espnDate}`

  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) {
    console.error('ESPN error:', res.status, await res.text())
    throw new Error('Erro ao buscar jogos')
  }

  const json = await res.json()
  const events: ESPNEvent[] = json.events || []

  return events.map((event) => {
    const comp = event.competitions[0]
    const home = comp.competitors.find((c) => c.homeAway === 'home')
    const away = comp.competitors.find((c) => c.homeAway === 'away')

    let status: GameOutput['status'] = 'scheduled'
    if (event.status.type.state === 'in') status = 'live'
    else if (event.status.type.state === 'post') status = 'final'

    return {
      id: event.id,
      date: event.date,
      name: event.shortName,
      status,
      statusDetail: event.status.type.shortDetail,
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
}

// ── Route Handler ───────────────────────────────────────────────────

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sport = searchParams.get('sport') || 'nba'
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const league = searchParams.get('league') || undefined

    const config = SPORTS[sport]
    if (!config) {
      return NextResponse.json(
        { error: `Esporte "${sport}" nao suportado. Disponiveis: ${Object.keys(SPORTS).join(', ')}` },
        { status: 400 }
      )
    }

    let games: GameOutput[]
    if (config.source === 'balldontlie') {
      games = await fetchBallDontLie(config, date)
    } else {
      games = await fetchESPN(config, date, league)
    }

    return NextResponse.json({
      data: games,
      date,
      sport,
      league: league || null,
      availableLeagues: sport === 'futebol' ? Object.keys(SOCCER_LEAGUES) : null,
    })
  } catch (error) {
    console.error('Error fetching sports schedule:', error)
    return NextResponse.json(
      { error: 'Erro interno ao buscar jogos' },
      { status: 500 }
    )
  }
}
