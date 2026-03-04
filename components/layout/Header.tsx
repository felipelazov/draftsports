'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

const leagues = [
  { name: 'NBA', href: '/catalogo/nba' },
  { name: 'NFL', href: '/catalogo/nfl' },
  { name: 'MLB', href: '/catalogo/mlb' },
  { name: 'NHL', href: '/catalogo/nhl' },
  { name: 'Futebol', href: '/catalogo/futebol' },
  { name: 'Retro', href: '/catalogo/retro' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { openCart, itemCount } = useCart()
  const count = itemCount()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[var(--z-modal)] transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-purple-500/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2D3436] hover:text-[#6C5CE7] transition-colors"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl lg:text-3xl font-black tracking-tighter"
              >
                <span className="bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] bg-clip-text text-transparent">
                  DRAFT
                </span>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Menu principal">
              {leagues.map((league) => (
                <Link
                  key={league.name}
                  href={league.href}
                  className="relative px-4 py-2 text-sm font-medium text-[#636E72] hover:text-[#6C5CE7] transition-colors group"
                >
                  {league.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] group-hover:w-3/4 transition-all duration-300" />
                </Link>
              ))}
              <Link
                href="/catalogo"
                className="px-4 py-2 text-sm font-medium text-[#6C5CE7] hover:text-[#5A4BD1] transition-colors"
              >
                Ver Tudo
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-3">
              <Link
                href="/catalogo"
                className="p-2 text-[#636E72] hover:text-[#6C5CE7] transition-colors"
                aria-label="Buscar"
              >
                <Search size={20} />
              </Link>
              <Link
                href="/conta/favoritos"
                className="p-2 text-[#636E72] hover:text-[#6C5CE7] transition-colors hidden sm:block"
                aria-label="Favoritos"
              >
                <Heart size={20} />
              </Link>
              <Link
                href="/login"
                className="p-2 text-[#636E72] hover:text-[#6C5CE7] transition-colors hidden sm:block"
                aria-label="Minha conta"
              >
                <User size={20} />
              </Link>
              <button
                onClick={openCart}
                className="relative p-2 text-[#636E72] hover:text-[#6C5CE7] transition-colors"
                aria-label={`Carrinho${count > 0 ? `, ${count} itens` : ''}`}
              >
                <ShoppingBag size={20} />
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[var(--z-overlay)] bg-black/50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 left-0 bottom-0 z-[var(--z-overlay)] w-72 bg-white shadow-2xl p-6 pt-24 lg:hidden"
            >
              <nav className="flex flex-col gap-2">
                {leagues.map((league) => (
                  <Link
                    key={league.name}
                    href={league.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-lg font-medium text-[#2D3436] hover:text-[#6C5CE7] hover:bg-[#6C5CE7]/5 rounded-xl transition-colors"
                  >
                    {league.name}
                  </Link>
                ))}
                <hr className="my-2 border-gray-100" />
                <Link
                  href="/catalogo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-lg font-semibold text-[#6C5CE7]"
                >
                  Ver Tudo
                </Link>
                <Link
                  href="/conta/favoritos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-lg text-[#636E72] hover:text-[#6C5CE7]"
                >
                  Favoritos
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-lg text-[#636E72] hover:text-[#6C5CE7]"
                >
                  Minha Conta
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
