'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, CalendarDays, RefreshCw } from 'lucide-react'
import { GameCard, GameCardSkeleton } from '@/components/sports/GameCard'
import type { Game } from '@/components/sports/GameCard'

export interface SportConfig {
  key: string
  name: string
  catalogPath: string
  color: string
  leagues?: LeagueOption[]
}

export interface LeagueOption {
  key: string
  name: string
}

const ALL_SPORTS: SportConfig[] = [
  { key: 'nba', name: 'NBA', catalogPath: '/catalogo/nba', color: '#C9082A' },
  { key: 'nfl', name: 'NFL', catalogPath: '/catalogo/nfl', color: '#013369' },
  { key: 'mlb', name: 'MLB', catalogPath: '/catalogo/mlb', color: '#002D72' },
  { key: 'nhl', name: 'NHL', catalogPath: '/catalogo/nhl', color: '#000000' },
  { key: 'futebol', name: 'Futebol', catalogPath: '/catalogo/futebol', color: '#009c3b' },
]

function formatDateBR(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export function SchedulePage({ sport }: { sport: SportConfig }) {
  const router = useRouter()
  const [date, setDate] = useState(getToday)
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeLeague, setActiveLeague] = useState(sport.leagues?.[0]?.key || '')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const hasLive = games.some((g) => g.status === 'live')

  const fetchGames = useCallback(
    async (targetDate: string, league?: string, showLoading = true) => {
      if (showLoading) setLoading(true)
      setError(null)

      try {
        let url = `/api/sports/schedule?sport=${sport.key}&date=${targetDate}`
        if (league) url += `&league=${league}`

        const res = await fetch(url)
        if (!res.ok) throw new Error('Erro ao carregar jogos')
        const json = await res.json()
        setGames(json.data || [])
      } catch {
        setError('Nao foi possivel carregar os jogos. Tente novamente.')
        setGames([])
      } finally {
        setLoading(false)
      }
    },
    [sport.key]
  )

  useEffect(() => {
    fetchGames(date, activeLeague || undefined)
  }, [date, activeLeague, fetchGames])

  // Auto-refresh every 30s when live games
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (hasLive) {
      intervalRef.current = setInterval(() => {
        fetchGames(date, activeLeague || undefined, false)
      }, 30000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [hasLive, date, activeLeague, fetchGames])

  const isToday = date === getToday()

  return (
    <main className="min-h-screen bg-[var(--bg)] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Sport Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          {ALL_SPORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => router.push(`/${s.key}`)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                s.key === sport.key
                  ? 'text-white shadow-md'
                  : 'text-[var(--text-secondary)] bg-[var(--card)] hover:bg-gray-100 border border-gray-100'
              }`}
              style={
                s.key === sport.key
                  ? { backgroundColor: sport.color }
                  : undefined
              }
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Sub-league tabs (Soccer) */}
        {sport.leagues && sport.leagues.length > 0 && (
          <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {sport.leagues.map((league) => (
              <button
                key={league.key}
                onClick={() => setActiveLeague(league.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeLeague === league.key
                    ? 'bg-[var(--text)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-gray-100'
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text)]">
              Jogos {sport.name}
            </h1>
            {hasLive && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                AO VIVO
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Acompanhe os resultados e a programacao.{' '}
            <Link
              href={sport.catalogPath}
              className="text-[#6C5CE7] hover:underline font-medium"
            >
              Ver camisas {sport.name}
            </Link>
          </p>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between bg-[var(--card)] rounded-[var(--radius-lg)] p-3 mb-6 shadow-sm border border-gray-100">
          <button
            onClick={() => setDate((d) => addDays(d, -1))}
            className="p-2 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-colors"
            aria-label="Dia anterior"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-3">
            <CalendarDays size={16} className="text-[var(--text-muted)]" />
            <span className="text-sm font-semibold text-[var(--text)] capitalize">
              {formatDateBR(date)}
            </span>
            {!isToday && (
              <button
                onClick={() => setDate(getToday())}
                className="text-xs font-medium text-[#6C5CE7] hover:underline"
              >
                Hoje
              </button>
            )}
          </div>

          <button
            onClick={() => setDate((d) => addDays(d, 1))}
            className="p-2 rounded-[var(--radius-md)] text-[var(--text-secondary)] hover:text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-colors"
            aria-label="Proximo dia"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Live indicator */}
        {hasLive && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-4">
            <RefreshCw size={12} className="animate-spin" />
            Atualizando automaticamente a cada 30s
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-[var(--text-secondary)] mb-4">{error}</p>
            <button
              onClick={() => fetchGames(date, activeLeague || undefined)}
              className="text-sm font-medium text-[#6C5CE7] hover:underline"
            >
              Tentar novamente
            </button>
          </motion.div>
        ) : games.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <CalendarDays
              size={48}
              className="mx-auto text-[var(--text-muted)] mb-4"
            />
            <p className="text-lg font-semibold text-[var(--text)] mb-1">
              Sem jogos neste dia
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Navegue para outro dia usando as setas acima.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-[#6C5CE7]/5 to-[#A29BFE]/5 rounded-[var(--radius-xl)] p-8 border border-[#6C5CE7]/10">
          <p className="text-lg font-bold text-[var(--text)] mb-2">
            Vista a camisa do seu time!
          </p>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Camisas oficiais com os melhores precos.
          </p>
          <Link
            href={sport.catalogPath}
            className="inline-flex items-center gap-2 bg-[#6C5CE7] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#5A4BD1] transition-colors"
          >
            Ver Camisas {sport.name}
          </Link>
        </div>
      </div>
    </main>
  )
}
