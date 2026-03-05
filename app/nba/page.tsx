import { SchedulePage } from '@/components/sports/SchedulePage'

export default function NBAPage() {
  return (
    <SchedulePage
      sport={{
        key: 'nba',
        name: 'NBA',
        catalogPath: '/catalogo/nba',
        color: '#C9082A',
      }}
    />
  )
}
