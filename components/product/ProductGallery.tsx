'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import { JerseyPlaceholder } from '@/components/ui/JerseyPlaceholder'

interface ProductGalleryProps {
  images: string[]
  productName: string
  league: string
}

export function ProductGallery({ images, productName, league }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center">
        <JerseyPlaceholder size="xl" league={league} className="w-40 h-40 lg:w-52 lg:h-52" />
      </div>
    )
  }

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full relative"
            >
              <Image
                src={images[current]}
                alt={`${productName} - Foto ${current + 1}`}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={current === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom button */}
          <button
            onClick={() => setZoomed(true)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Ampliar imagem"
          >
            <ZoomIn size={18} className="text-[#2D3436]" />
          </button>

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Foto anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Proxima foto"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
              {current + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  i === current
                    ? 'border-[var(--primary)] shadow-lg shadow-purple-500/20'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} - Miniatura ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomed && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomed(false)}
              className="fixed inset-0 bg-black/90 z-50 cursor-zoom-out"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setZoomed(false)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-zoom-out"
            >
              <div className="relative w-full max-w-3xl aspect-square">
                <Image
                  src={images[current]}
                  alt={`${productName} - Ampliada`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
