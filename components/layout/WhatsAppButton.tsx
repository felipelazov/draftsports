'use client'

import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

export function WhatsAppButton() {
  const { links } = useSiteSettings()
  const url = `https://wa.me/${links.whatsapp_number}?text=${encodeURIComponent(links.whatsapp_message)}`

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-shadow"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={28} className="text-white fill-white" />
    </motion.a>
  )
}
