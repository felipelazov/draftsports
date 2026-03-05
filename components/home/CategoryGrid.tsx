'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { leagues } from '@/lib/mock-data'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

export function CategoryGrid() {
  const { sections } = useSiteSettings()
  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-black text-[#2D3436]">
          {sections.categories_title}
        </h2>
        <p className="text-[#636E72] mt-3 text-lg">
          {sections.categories_subtitle}
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {leagues.map((league) => (
          <motion.div key={league.id} variants={item}>
            <Link href={`/catalogo/${league.id.toLowerCase()}`}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative group bg-white rounded-2xl p-6 text-center cursor-pointer overflow-hidden shadow-sm hover:shadow-[var(--shadow-glow)] border border-transparent hover:border-[var(--primary-light)]/20 transition-all duration-300 h-full min-h-[160px] flex flex-col items-center justify-center"
              >
                {/* Background gradient on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${league.color}, transparent)` }}
                />

                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {league.icon}
                </div>
                <h3 className="font-bold text-[#2D3436] text-lg">
                  {league.name}
                </h3>
                <p className="text-xs text-[#636E72] mt-1">
                  {league.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ background: league.color }}
                />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
