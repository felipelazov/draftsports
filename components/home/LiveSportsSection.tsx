'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Tv, Clock } from 'lucide-react'
import type { Game } from '@/components/sports/GameCard'

const SPORTS = [
  { key: 'nba', name: 'NBA', color: '#C9082A' },
  { key: 'nfl', name: 'NFL', color: '#013369' },
  { key: 'mlb', name: 'MLB', color: '#002D72' },
  { key: 'nhl', name: 'NHL', color: '#111' },
  { key: 'futebol', name: 'Futebol', color: '#009c3b' },
]

function MiniGameCard({ game }: { game: Game }) {
  const isLive = game.status === 'live'
  const isFinal = game.status === 'final'
  const showScore = isLive || isFinal

  return (
    <div
      className={`flex-shrink-0 w-[280px] sm:w-[300px] bg-white/10 backdrop-blur-sm rounded-2xl p-4 border transition-all hover:bg-white/15 ${
        isLive ? 'border-emerald-400/40' : 'border-white/10'
      }`}
    >
      {/* Status */}
      <div className="flex items-center justify-between mb-3">
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            AO VIVO
          </span>
        ) : isFinal ? (
          <span className="text-[11px] font-semibold text-white/50">{game.statusDetail}</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/70">
            <Clock size={10} />
            {game.timeBRT}
          </span>
        )}
        {game.broadcasts?.[0] && (
          <span className="inline-flex items-center gap-1 text-[10px] text-white/40">
            <Tv size={9} />
            {game.broadcasts[0]}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-2">
        {[game.awayTeam, game.homeTeam].map((team, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {team.logo ? (
                <img src={team.logo} alt={team.name} className="w-5 h-5 object-contain" loading="lazy" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-white/20" />
              )}
              <span className="text-sm font-medium text-white">{team.name}</span>
            </div>
            <span className={`text-sm tabular-nums ${showScore ? 'font-bold text-white' : 'text-white/30'}`}>
              {showScore ? team.score : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniGameSkeleton() {
  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[300px] bg-white/10 rounded-2xl p-4 border border-white/10">
      <div className="h-3 w-16 rounded bg-white/10 animate-pulse mb-3" />
      <div className="space-y-3">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />
              <div className="h-3.5 w-24 rounded bg-white/10 animate-pulse" />
            </div>
            <div className="h-3.5 w-6 rounded bg-white/10 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function LiveSportsSection() {
  const [activeSport, setActiveSport] = useState('nba')
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGames = useCallback(async (sport: string) => {
    setLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`/api/sports/schedule?sport=${sport}&date=${today}`)
      if (!res.ok) throw new Error()
      const json = await res.json()
      setGames(json.data || [])
    } catch {
      setGames([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGames(activeSport)
  }, [activeSport, fetchGames])

  const hasLive = games.some((g) => g.status === 'live')

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden bg-[#1a1a2e]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 text-[200px] font-black text-white select-none leading-none -translate-x-10 -translate-y-10">
          LIVE
        </div>
        <div className="absolute bottom-0 right-0 text-[160px] font-black text-white select-none leading-none translate-x-10 translate-y-10">
          SPORTS
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Jogos ao Vivo
              </h2>
              {hasLive && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  LIVE
                </span>
              )}
            </div>
            <p className="text-white/50 text-sm sm:text-base">
              Acompanhe os jogos de hoje e vista a camisa do seu time
            </p>
          </motion.div>

          <Link
            href={`/${activeSport}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#A29BFE] hover:text-white transition-colors group"
          >
            Ver todos os jogos
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Sport pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {SPORTS.map((sport) => (
            <button
              key={sport.key}
              onClick={() => setActiveSport(sport.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeSport === sport.key
                  ? 'text-white shadow-lg'
                  : 'text-white/50 bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
              style={
                activeSport === sport.key
                  ? { backgroundColor: sport.color }
                  : undefined
              }
            >
              {sport.name}
            </button>
          ))}
        </div>

        {/* Games carousel */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <MiniGameSkeleton key={i} />)
          ) : games.length === 0 ? (
            <div className="w-full text-center py-10">
              <p className="text-white/40 text-sm">Sem jogos hoje para esta liga</p>
              <Link
                href={`/${activeSport}`}
                className="text-[#A29BFE] text-sm font-medium hover:underline mt-2 inline-block"
              >
                Ver outros dias
              </Link>
            </div>
          ) : (
            games.slice(0, 8).map((game) => (
              <MiniGameCard key={game.id} game={game} />
            ))
          )}
        </div>

        {/* CTA */}
        {!loading && games.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href={`/${activeSport}`}
              className="inline-flex items-center gap-2 bg-[#6C5CE7] text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-[#5A4BD1] transition-colors shadow-lg shadow-[#6C5CE7]/25"
            >
              Ver Calendario Completo
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
