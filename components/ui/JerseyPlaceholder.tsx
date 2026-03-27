interface JerseyPlaceholderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  league?: string
  className?: string
}

const sizes = {
  sm: { width: 48, height: 48 },
  md: { width: 80, height: 80 },
  lg: { width: 120, height: 120 },
  xl: { width: 180, height: 180 },
}

const leagueColors: Record<string, [string, string]> = {
  NBA: ['#C9082A', '#1D428A'],
  NFL: ['#013369', '#D50A0A'],
  MLB: ['#002D72', '#E81828'],
  NHL: ['#000000', '#A2AAAD'],
  FUTEBOL: ['#00B894', '#0984E3'],
  RETRO: ['#6C5CE7', '#A29BFE'],
  JORDAN: ['#E31937', '#000000'],
  default: ['#6C5CE7', '#A29BFE'],
}

export function JerseyPlaceholder({ size = 'lg', league, className = '' }: JerseyPlaceholderProps) {
  const { width, height } = sizes[size]
  const [color1, color2] = leagueColors[league || 'default'] || leagueColors.default

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`jersey-grad-${league}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color2} stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id={`jersey-stroke-${league}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color2} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Jersey body */}
      <path
        d="M36 28L24 36V52L32 48V92H88V48L96 52V36L84 28H76C76 34.627 70.627 40 64 40H56C49.373 40 44 34.627 44 28H36Z"
        fill={`url(#jersey-grad-${league})`}
        stroke={`url(#jersey-stroke-${league})`}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Collar */}
      <path
        d="M44 28C44 28 48 32 60 32C72 32 76 28 76 28"
        stroke={`url(#jersey-stroke-${league})`}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Number */}
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fill={color1}
        fillOpacity="0.25"
        fontSize="24"
        fontWeight="900"
        fontFamily="var(--font-inter), sans-serif"
      >
        23
      </text>
    </svg>
  )
}
