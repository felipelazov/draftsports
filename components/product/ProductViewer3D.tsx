'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCw, ZoomIn, ZoomOut } from 'lucide-react'
import { JerseyPlaceholder } from '@/components/ui/JerseyPlaceholder'

interface ProductViewer3DProps {
  productName: string
  league: string
}

export function ProductViewer3D({ productName, league }: ProductViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const delta = e.clientX - startX
    setRotation((prev) => prev + delta * 0.5)
    setStartX(e.clientX)
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const delta = e.touches[0].clientX - startX
    setRotation((prev) => prev + delta * 0.5)
    setStartX(e.touches[0].clientX)
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        tabIndex={0}
        role="application"
        aria-label="Visualizador 3D da camisa"
        className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/5 to-[#A29BFE]/5" />

        {/* Jersey display */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `rotateY(${rotation}deg) scale(${scale})`,
            transformStyle: 'preserve-3d',
            perspective: '1000px',
          }}
          animate={{
            y: isDragging ? 0 : [0, -10, 0],
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="text-center">
            <div className="mb-4">
              <JerseyPlaceholder size="xl" league={league} className="w-40 h-40 lg:w-52 lg:h-52" />
            </div>
            <div className="mt-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl inline-block">
              <p className="text-sm font-bold text-[#2D3436]">{productName}</p>
              <p className="text-xs text-[#636E72]">{league}</p>
            </div>
          </div>
        </motion.div>

        {/* Drag hint */}
        {!isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm"
          >
            <RotateCw size={12} className="inline mr-1.5" />
            Arraste para girar
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setScale((s) => Math.min(s + 0.2, 1.5))}
          aria-label="Aumentar zoom"
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ZoomIn size={18} className="text-[#2D3436]" />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(s - 0.2, 0.6))}
          aria-label="Diminuir zoom"
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ZoomOut size={18} className="text-[#2D3436]" />
        </button>
        <button
          onClick={() => {
            setRotation(0)
            setScale(1)
          }}
          aria-label="Resetar visualização"
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <RotateCw size={18} className="text-[#2D3436]" />
        </button>
      </div>
    </div>
  )
}
