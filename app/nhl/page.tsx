import { SchedulePage } from '@/components/sports/SchedulePage'

export default function NHLPage() {
  return (
    <SchedulePage
      sport={{
        key: 'nhl',
        name: 'NHL',
        catalogPath: '/catalogo/nhl',
        color: '#000000',
      }}
    />
  )
}
