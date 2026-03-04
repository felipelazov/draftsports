'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Sparkles, Star } from 'lucide-react'
import { JerseyPlaceholder } from '@/components/ui/JerseyPlaceholder'

interface Hero3DProps {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: string | null
}

export function Hero3D({ title, subtitle, ctaText, ctaLink, backgroundImage }: Hero3DProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create floating particles
    const particles: HTMLDivElement[] = []
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div')
      const size = Math.random() * 6 + 2
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(108, 92, 231, ${Math.random() * 0.5 + 0.1});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float-particle ${Math.random() * 6 + 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 4}s;
        pointer-events: none;
      `
      container.appendChild(particle)
      particles.push(particle)
    }

    // Add keyframes
    const style = document.createElement('style')
    style.textContent = `
      @keyframes float-particle {
        0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
        25% { transform: translateY(-30px) translateX(15px) scale(1.2); opacity: 0.8; }
        50% { transform: translateY(-15px) translateX(-10px) scale(0.8); opacity: 0.5; }
        75% { transform: translateY(-40px) translateX(20px) scale(1.1); opacity: 0.7; }
      }
    `
    document.head.appendChild(style)

    return () => {
      particles.forEach((p) => p.remove())
      style.remove()
    }
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {
        background: 'linear-gradient(to bottom right, #1a1a2e, #16213e, #0f3460)',
      }}
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#6C5CE7]/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-[#A29BFE]/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FF6B6B]/10 rounded-full blur-[80px]" />
      </div>

      {/* Particles container */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-32 lg:py-0 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/80 mb-6"
            >
              <Sparkles size={16} className="text-[#A29BFE]" />
              <span>Nova coleção 2026 disponível</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight"
            >
              {title ? (
                <span dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }} />
              ) : (
                <>
                  Vista a camisa
                  <br />
                  <span className="bg-gradient-to-r from-[#6C5CE7] via-[#A29BFE] to-[#6C5CE7] bg-clip-text text-transparent bg-[length:200%] animate-[gradient_3s_ease_infinite]">
                    do seu time
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-white/60 mt-6 max-w-lg mx-auto lg:mx-0"
            >
              {subtitle || 'Camisas oficiais de NBA, NFL, MLB, NHL e Futebol. Qualidade premium com entrega para todo Brasil.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start"
            >
              <Link href={ctaLink || '/catalogo'}>
                <Button size="lg" className="text-base group">
                  {ctaText || 'Explorar Catalogo'}
                  <ArrowRight
                    size={20}
                    className="inline ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </Link>
              <Link href="/catalogo/retro">
                <Button variant="outline" size="lg" className="text-base border-white/30 text-white hover:bg-white/10 hover:text-white">
                  Coleção Retro
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { value: '5K+', label: 'Clientes' },
                { value: '500+', label: 'Produtos' },
                { value: '4.9', label: 'Avaliação' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 3D Jersey Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.5, type: 'spring' }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-80 h-96 lg:w-[420px] lg:h-[500px]">
              {/* Glow behind jersey */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/40 to-[#A29BFE]/20 rounded-3xl blur-3xl" />

              {/* Jersey placeholder card */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotateY: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 flex items-center justify-center overflow-hidden"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                {/* Jersey silhouette */}
                <div className="text-center">
                  <JerseyPlaceholder size="xl" className="w-32 h-32 lg:w-40 lg:h-40 opacity-90" />
                  <div className="text-white/60 text-sm font-medium tracking-wider uppercase">
                    Premium Jersey
                  </div>
                  <div className="text-[#A29BFE] text-xs mt-1">
                    Collection 2026
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [-5, 5, -5], x: [-3, 3, -3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-6 right-6 bg-[#FF6B6B] text-white px-3 py-1 rounded-full text-xs font-bold"
                >
                  -22% OFF
                </motion.div>

                <motion.div
                  animate={{ y: [5, -5, 5], x: [3, -3, 3] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-8 left-6 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium"
                >
                  <Star size={12} className="inline fill-yellow-400 text-yellow-400 mr-1" />4.9 (312 reviews)
                </motion.div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
              </motion.div>

              {/* Orbiting elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-3 h-3 bg-[#6C5CE7] rounded-full opacity-60" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-2 h-2 bg-[#A29BFE] rounded-full opacity-40" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  )
}
