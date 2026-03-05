import { SchedulePage } from '@/components/sports/SchedulePage'

export default function FutebolPage() {
  return (
    <SchedulePage
      sport={{
        key: 'futebol',
        name: 'Futebol',
        catalogPath: '/catalogo/futebol',
        color: '#009c3b',
        leagues: [
          { key: 'brasileirao', name: 'Brasileirao' },
          { key: 'champions-league', name: 'Champions League' },
          { key: 'premier-league', name: 'Premier League' },
          { key: 'la-liga', name: 'La Liga' },
          { key: 'serie-a', name: 'Serie A' },
          { key: 'bundesliga', name: 'Bundesliga' },
          { key: 'ligue-1', name: 'Ligue 1' },
          { key: 'mls', name: 'MLS' },
          { key: 'libertadores', name: 'Libertadores' },
          { key: 'copa-do-brasil', name: 'Copa do Brasil' },
        ],
      }}
    />
  )
}
