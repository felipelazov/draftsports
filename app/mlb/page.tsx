import { SchedulePage } from '@/components/sports/SchedulePage'

export default function MLBPage() {
  return (
    <SchedulePage
      sport={{
        key: 'mlb',
        name: 'MLB',
        catalogPath: '/catalogo/mlb',
        color: '#002D72',
      }}
    />
  )
}
