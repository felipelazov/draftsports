'use client'

import Link from 'next/link'
import { Instagram, Twitter, Youtube } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

const footerLinks = {
  Ligas: [
    { name: 'NBA', href: '/catalogo/nba' },
    { name: 'NFL', href: '/catalogo/nfl' },
    { name: 'MLB', href: '/catalogo/mlb' },
    { name: 'NHL', href: '/catalogo/nhl' },
    { name: 'Futebol', href: '/catalogo/futebol' },
  ],
  Institucional: [
    { name: 'Sobre Nós', href: '/sobre' },
    { name: 'Política de Privacidade', href: '/privacidade' },
    { name: 'Termos de Uso', href: '/termos' },
    { name: 'Trocas e Devoluções', href: '/trocas' },
  ],
  Ajuda: [
    { name: 'Perguntas Frequentes', href: '/faq' },
    { name: 'Rastrear Pedido', href: '/conta/pedidos' },
    { name: 'Guia de Tamanhos', href: '/tamanhos' },
    { name: 'Contato', href: '/contato' },
  ],
}

export function Footer() {
  const { links } = useSiteSettings()

  const socialLinks = [
    { icon: Instagram, url: links.instagram_url, label: 'Instagram' },
    { icon: Twitter, url: links.twitter_url, label: 'Twitter' },
    { icon: Youtube, url: links.youtube_url, label: 'YouTube' },
  ]

  return (
    <footer className="bg-[#2D3436] text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">
                Receba ofertas exclusivas
              </h3>
              <p className="text-gray-400 text-sm">
                Cadastre-se e ganhe 10% de desconto na primeira compra
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-l-xl text-white placeholder-gray-400 w-full md:w-72 focus:outline-none focus:border-[#6C5CE7]"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] rounded-r-xl font-semibold whitespace-nowrap"
              >
                Inscrever
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] bg-clip-text text-transparent">
                DRAFT
              </span>
            </Link>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              A melhor loja de camisas esportivas americanas do Brasil.
              Autenticidade e estilo em cada peça.
            </p>
            <div className="flex gap-3 mt-4">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url || '#'}
                  target={url ? '_blank' : undefined}
                  rel={url ? 'noopener noreferrer' : undefined}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#6C5CE7] transition-colors"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[#A29BFE] transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 DRAFT. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-3">
            {['PIX', 'Visa', 'Master', 'Amex'].map((method) => (
              <span
                key={method}
                className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider bg-white/5 border border-white/10 rounded-md text-gray-400"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
