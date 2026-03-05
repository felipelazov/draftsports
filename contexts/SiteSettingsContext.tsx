'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { SiteLinks, ThemeColors } from '@/types'

const defaultLinks: SiteLinks = {
  whatsapp_number: '5511999999999',
  whatsapp_message: 'Olá! Vim pelo site DRAFT e gostaria de mais informações.',
  instagram_url: '',
  twitter_url: '',
  youtube_url: '',
  email: 'contato@draftsports.com.br',
}

const themeVarMap: Record<string, string> = {
  primary: '--primary',
  primary_dark: '--primary-dark',
  primary_light: '--primary-light',
  accent: '--accent',
  success: '--success',
  warning: '--warning',
  info: '--info',
  bg: '--bg',
  bg_elevated: '--bg-elevated',
  bg_sunken: '--bg-sunken',
  card: '--card',
  text: '--text',
  text_secondary: '--text-secondary',
  text_muted: '--text-muted',
}

interface SiteSettingsContextType {
  links: SiteLinks
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  links: defaultLinks,
})

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [links, setLinks] = useState<SiteLinks>(defaultLinks)

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.links) {
          setLinks({ ...defaultLinks, ...data.links })
        }
        if (data.theme) {
          const root = document.documentElement
          for (const [key, value] of Object.entries(data.theme)) {
            const varName = themeVarMap[key]
            if (varName && typeof value === 'string') {
              root.style.setProperty(varName, value)
            }
          }
        }
      })
      .catch(() => {})
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ links }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}
