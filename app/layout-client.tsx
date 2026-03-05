'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <SiteSettingsProvider>
      <Header />
      <CartDrawer />
      <main id="main-content" className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </SiteSettingsProvider>
  )
}
