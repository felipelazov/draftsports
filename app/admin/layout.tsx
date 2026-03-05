'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

const darkTheme = {
  '--bg': '#0f0f1a',
  '--bg-elevated': '#1a1a2e',
  '--bg-sunken': '#0a0a14',
  '--card': '#1c1c30',
  '--text': '#E2E8F0',
  '--text-secondary': '#94A3B8',
  '--text-muted': '#64748B',
  '--gray-50': 'rgba(255,255,255,0.03)',
  '--gray-100': 'rgba(255,255,255,0.06)',
  '--gray-200': 'rgba(255,255,255,0.10)',
  '--gray-300': 'rgba(255,255,255,0.15)',
  '--border-light': 'rgba(255,255,255,0.06)',
  '--shadow-sm': '0 1px 3px rgba(0,0,0,0.4)',
  '--shadow-md': '0 4px 12px rgba(0,0,0,0.5)',
  '--shadow-lg': '0 8px 24px rgba(0,0,0,0.6)',
  '--shadow-xl': '0 16px 48px rgba(0,0,0,0.7)',
  '--shadow-glow': '0 0 20px rgba(108,92,231,0.3)',
}

const lightTheme = {
  '--bg': '#F5F6FA',
  '--bg-elevated': '#FFFFFF',
  '--bg-sunken': '#ECEDF2',
  '--card': '#FFFFFF',
  '--text': '#1E1E2D',
  '--text-secondary': '#6B7280',
  '--text-muted': '#9CA3AF',
  '--gray-50': 'rgba(0,0,0,0.02)',
  '--gray-100': '#F3F4F6',
  '--gray-200': 'rgba(0,0,0,0.08)',
  '--gray-300': 'rgba(0,0,0,0.12)',
  '--border-light': 'rgba(0,0,0,0.06)',
  '--shadow-sm': '0 1px 3px rgba(0,0,0,0.06)',
  '--shadow-md': '0 4px 12px rgba(0,0,0,0.08)',
  '--shadow-lg': '0 8px 24px rgba(0,0,0,0.10)',
  '--shadow-xl': '0 16px 48px rgba(0,0,0,0.12)',
  '--shadow-glow': '0 0 20px rgba(108,92,231,0.15)',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('draft-admin-theme')
    if (stored) setIsDark(stored === 'dark')
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      localStorage.setItem('draft-admin-theme', next ? 'dark' : 'light')
      return next
    })
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const theme = isDark ? darkTheme : lightTheme

  return (
    <div
      className="flex min-h-screen"
      style={theme as React.CSSProperties}
    >
      <AdminSidebar isDark={isDark} onToggleTheme={toggleTheme} />
      <main className="flex-1 p-8 overflow-auto bg-[var(--bg)]">
        {children}
      </main>
    </div>
  )
}
