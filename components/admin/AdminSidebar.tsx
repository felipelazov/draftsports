'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Shield, ShoppingBag, Settings, LogOut, Sun, Moon } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, masterOnly: false },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag, masterOnly: false },
  { href: '/admin/produtos', label: 'Produtos', icon: Package, masterOnly: false },
  { href: '/admin/times', label: 'Times', icon: Shield, masterOnly: false },
  { href: '/admin/configuracoes', label: 'Configuracoes', icon: Settings, masterOnly: true },
]

const masterEmails = (process.env.NEXT_PUBLIC_ADMIN_MASTER_EMAILS || '').split(',').map(e => e.trim().toLowerCase())

interface AdminSidebarProps {
  isDark: boolean
  onToggleTheme: () => void
}

export function AdminSidebar({ isDark, onToggleTheme }: AdminSidebarProps) {
  const pathname = usePathname()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email?.toLowerCase() || null)
    })
  }, [])

  const isMaster = userEmail ? masterEmails.includes(userEmail) : false
  const visibleItems = navItems.filter(item => !item.masterOnly || isMaster)

  const handleLogout = async () => {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <aside className="w-64 min-h-screen bg-[#1a1a2e] text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="text-2xl font-black">
          <span className="gradient-text">DRAFT</span>
          <span className="text-xs font-normal text-white/40 ml-2">admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors w-full cursor-pointer"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {isDark ? 'Modo Claro' : 'Modo Escuro'}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors w-full cursor-pointer"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  )
}
