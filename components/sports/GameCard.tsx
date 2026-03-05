'use client'

import { motion } from 'framer-motion'

export interface GameTeam {
  name: string
  fullName: string
  abbreviation: string
  logo: string
  score: string
}

export interface Game {
  id: string
  date: string
  name: string
  status: 'scheduled' | 'live' | 'final'
  statusDetail: string
  homeTeam: GameTeam
  awayTeam: GameTeam
}

function StatusBadge({ status, detail }: { status: Game['status']; detail: string }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        {detail}
      </span>
    )
  }

  if (status === 'final') {
    return (
      <span className="text-xs font-semibold text-[var(--text-muted)]">
        {detail}
      </span>
    )
  }

  return (
    <span className="text-xs font-medium text-[var(--text-secondary)]">
      {detail}
    </span>
  )
}

function TeamRow({
  team,
  isWinner,
  showScore,
}: {
  team: GameTeam
  isWinner: boolean
  showScore: boolean
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-3">
        {team.logo && (
          <img
            src={team.logo}
            alt={team.name}
            className="w-6 h-6 object-contain"
            loading="lazy"
          />
        )}
        <span className="text-xs font-bold text-[var(--text-muted)] w-8 hidden sm:inline">
          {team.abbreviation}
        </span>
        <span
          className={`text-sm ${
            isWinner
              ? 'font-bold text-[var(--text)]'
              : 'font-medium text-[var(--text-secondary)]'
          }`}
        >
          {team.name}
        </span>
      </div>
      <span
        className={`text-lg tabular-nums ${
          showScore
            ? isWinner
              ? 'font-bold text-[var(--text)]'
              : 'font-medium text-[var(--text-secondary)]'
            : 'text-[var(--text-muted)]'
        }`}
      >
        {showScore ? team.score : '—'}
      </span>
    </div>
  )
}

export function GameCard({ game }: { game: Game }) {
  const showScore = game.status === 'live' || game.status === 'final'
  const homeScore = parseInt(game.homeTeam.score) || 0
  const awayScore = parseInt(game.awayTeam.score) || 0
  const homeWins = showScore && game.status === 'final' && homeScore > awayScore
  const awayWins = showScore && game.status === 'final' && awayScore > homeScore

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[var(--card)] rounded-[var(--radius-lg)] p-4 shadow-sm border transition-all hover:shadow-md ${
        game.status === 'live'
          ? 'border-emerald-200 shadow-emerald-500/10'
          : 'border-gray-100'
      }`}
    >
      <div className="mb-3">
        <StatusBadge status={game.status} detail={game.statusDetail} />
      </div>

      <div className="space-y-0.5">
        <TeamRow
          team={game.awayTeam}
          isWinner={awayWins}
          showScore={showScore}
        />
        <div className="border-t border-gray-50" />
        <TeamRow
          team={game.homeTeam}
          isWinner={homeWins}
          showScore={showScore}
        />
      </div>
    </motion.div>
  )
}

export function GameCardSkeleton() {
  return (
    <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-4 shadow-sm border border-gray-100">
      <div className="h-4 w-20 rounded bg-gray-100 animate-shimmer mb-3" />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-100 animate-shimmer" />
            <div className="h-4 w-28 rounded bg-gray-100 animate-shimmer" />
          </div>
          <div className="h-5 w-8 rounded bg-gray-100 animate-shimmer" />
        </div>
        <div className="border-t border-gray-50" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-100 animate-shimmer" />
            <div className="h-4 w-24 rounded bg-gray-100 animate-shimmer" />
          </div>
          <div className="h-5 w-8 rounded bg-gray-100 animate-shimmer" />
        </div>
      </div>
    </div>
  )
}
