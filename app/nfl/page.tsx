import { SchedulePage } from '@/components/sports/SchedulePage'

export default function NFLPage() {
  return (
    <SchedulePage
      sport={{
        key: 'nfl',
        name: 'NFL',
        catalogPath: '/catalogo/nfl',
        color: '#013369',
      }}
    />
  )
}
