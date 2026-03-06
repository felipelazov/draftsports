'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left p-4 rounded-xl hover:bg-[#F8F9FE] transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-[#2D3436]">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-[#636E72] flex-shrink-0" />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#636E72] mt-3 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}

export default function FaqPage() {
  const { pageFaq } = useSiteSettings()

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-black text-[#2D3436] mb-2">{pageFaq.title}</h1>
      <p className="text-[#636E72] mb-10">{pageFaq.subtitle}</p>

      <div className="space-y-8">
        {pageFaq.categories.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-bold text-[#6C5CE7] mb-3">{section.category}</h2>
            <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100">
              {section.questions.map((item) => (
                <FaqItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
