import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LayoutClient } from './layout-client'
import { ThemeColors } from '@/types'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'DRAFT | Camisas Esportivas Americanas',
  description:
    'A melhor loja de camisas esportivas americanas do Brasil. NBA, NFL, MLB, NHL e Futebol. Qualidade premium, entrega rapida.',
  keywords: [
    'camisas esportivas',
    'NBA',
    'NFL',
    'MLB',
    'NHL',
    'futebol',
    'jerseys',
    'esportes americanos',
  ],
  openGraph: {
    title: 'DRAFT | Camisas Esportivas Americanas',
    description:
      'A melhor loja de camisas esportivas americanas do Brasil.',
    type: 'website',
  },
}

async function getThemeColors(): Promise<ThemeColors | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) return null

    const res = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?setting_key=eq.theme_colors&select=setting_value`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) return null
    const data = await res.json()
    if (!data?.[0]?.setting_value) return null
    return data[0].setting_value as ThemeColors
  } catch {
    return null
  }
}

function buildThemeStyle(colors: ThemeColors): string {
  return `:root {
    --primary: ${colors.primary};
    --primary-dark: ${colors.primary_dark};
    --primary-light: ${colors.primary_light};
    --primary-glow: ${colors.primary}66;
    --accent: ${colors.accent};
    --success: ${colors.success};
    --warning: ${colors.warning};
    --info: ${colors.info};
    --bg: ${colors.bg};
    --bg-elevated: ${colors.bg_elevated};
    --bg-sunken: ${colors.bg_sunken};
    --card: ${colors.card};
    --text: ${colors.text};
    --text-secondary: ${colors.text_secondary};
    --text-muted: ${colors.text_muted};
    --focus-ring: ${colors.primary}80;
    --shadow-glow: 0 8px 32px ${colors.primary}26;
    --shadow-glow-lg: 0 16px 48px ${colors.primary}40;
  }`
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const themeColors = await getThemeColors()

  return (
    <html lang="pt-BR">
      <head>
        {themeColors && (
          <style dangerouslySetInnerHTML={{ __html: buildThemeStyle(themeColors) }} />
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[var(--bg)] text-[var(--text)]`}>
        <a href="#main-content" className="skip-link">
          Pular para conteudo principal
        </a>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
