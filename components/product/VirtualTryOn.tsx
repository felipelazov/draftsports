'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Upload, Download, Clock, Lock, Camera, AlertCircle, Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import type { Product } from '@/types'

interface VirtualTryOnProps {
  product: Product
}

type TryOnState = 'idle' | 'upload' | 'processing' | 'result' | 'limit' | 'error' | 'not-logged'

function resizeImage(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize
            width = maxSize
          } else {
            width = (width / height) * maxSize
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function VirtualTryOn({ product }: VirtualTryOnProps) {
  const [state, setState] = useState<TryOnState>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user)
    })
  }, [])

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setError('Use uma imagem JPEG, PNG ou WebP.')
      setState('error')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Imagem muito grande. Maximo 10MB.')
      setState('error')
      return
    }

    const resized = await resizeImage(file, 1024)
    setPreview(resized)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleGenerate = async () => {
    if (!preview) return

    setState('processing')
    setError('')

    try {
      const productImageUrl = product.images[0]

      const res = await fetch('/api/virtual-tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPhoto: preview,
          productId: product.id,
          productImageUrl,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setState('limit')
          return
        }
        throw new Error(data.error || 'Erro ao gerar imagem')
      }

      setResult(data.image)
      setState('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.')
      setState('error')
    }
  }

  const handleDownload = () => {
    if (!result) return
    const link = document.createElement('a')
    link.href = result
    link.download = `draft-tryon-${product.slug}.jpg`
    link.click()
  }

  const openModal = () => {
    if (isLoggedIn === false) {
      setState('not-logged')
      return
    }
    setState('upload')
    setPreview(null)
    setResult(null)
    setError('')
  }

  const closeModal = () => {
    setState('idle')
    setPreview(null)
    setResult(null)
    setError('')
  }

  const getCountdown = () => {
    const now = new Date()
    const midnight = new Date()
    midnight.setDate(midnight.getDate() + 1)
    midnight.setHours(0, 0, 0, 0)
    const diff = midnight.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}min`
  }

  return (
    <>
      {/* Trigger Button */}
      <div className="mt-5">
        <button
          onClick={openModal}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border-2 border-dashed border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[var(--primary)] font-semibold text-sm hover:border-[var(--primary)]/60 hover:bg-[var(--primary)]/10 transition-all group"
        >
          <Sparkles size={18} className="group-hover:animate-pulse" />
          Experimente virtualmente com IA
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {state !== 'idle' && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                      <Sparkles size={18} className="text-[var(--primary)]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--text)]">Provador Virtual</h3>
                      <p className="text-xs text-[var(--text-secondary)]">Powered by Gemini AI</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5">
                  {/* Not Logged In */}
                  {state === 'not-logged' && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <Lock size={28} className="text-gray-400" />
                      </div>
                      <h4 className="text-lg font-bold text-[var(--text)] mb-2">
                        Faca login para experimentar
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)] mb-6">
                        O provador virtual esta disponivel para clientes logados.
                      </p>
                      <Button
                        onClick={() => {
                          closeModal()
                          window.location.href = '/login'
                        }}
                        size="md"
                      >
                        Fazer Login
                      </Button>
                    </div>
                  )}

                  {/* Upload State */}
                  {state === 'upload' && (
                    <div>
                      {/* Instructions */}
                      <div className="bg-blue-50 rounded-xl p-4 mb-5">
                        <div className="flex items-start gap-2.5">
                          <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
                          <div className="text-sm text-blue-800 space-y-1">
                            <p className="font-semibold">Dicas para melhores resultados:</p>
                            <ul className="list-disc list-inside space-y-0.5 text-blue-700">
                              <li>Envie uma foto sua de frente, da cintura para cima</li>
                              <li>Boa iluminacao e fundo simples dao melhores resultados</li>
                              <li>Sua foto nao e armazenada</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Upload Area */}
                      {!preview ? (
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                            isDragging
                              ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                              : 'border-gray-200 hover:border-[var(--primary)]/50 hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-14 h-14 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-3">
                            <Camera size={24} className="text-[var(--primary)]" />
                          </div>
                          <p className="font-semibold text-[var(--text)] mb-1">
                            Arraste sua foto aqui
                          </p>
                          <p className="text-sm text-[var(--text-secondary)]">
                            ou clique para selecionar (JPEG, PNG, WebP)
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFile(file)
                            }}
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative rounded-xl overflow-hidden bg-gray-100">
                            <img
                              src={preview}
                              alt="Sua foto"
                              className="w-full max-h-80 object-contain"
                            />
                            <button
                              onClick={() => {
                                setPreview(null)
                                if (fileInputRef.current) fileInputRef.current.value = ''
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <Button
                            onClick={handleGenerate}
                            size="lg"
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <Sparkles size={18} />
                            Gerar Provador Virtual
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Processing State */}
                  {state === 'processing' && (
                    <div className="text-center py-10">
                      <div className="relative w-20 h-20 mx-auto mb-5">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="w-full h-full rounded-full border-4 border-[var(--primary)]/20 border-t-[var(--primary)]"
                        />
                        <Sparkles size={24} className="text-[var(--primary)] absolute inset-0 m-auto" />
                      </div>
                      <h4 className="text-lg font-bold text-[var(--text)] mb-2">
                        Preparando seu look...
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)]">
                        A IA esta vestindo voce com a camisa. Isso pode levar alguns segundos.
                      </p>
                      <div className="mt-5 mx-auto max-w-xs">
                        <motion.div
                          className="h-1.5 bg-gray-100 rounded-full overflow-hidden"
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: '90%' }}
                            transition={{ duration: 20, ease: 'easeOut' }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {/* Result State */}
                  {state === 'result' && result && (
                    <div className="space-y-4">
                      <div className="rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={result}
                          alt="Resultado do provador virtual"
                          className="w-full object-contain"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleDownload}
                          size="md"
                          className="flex-1 flex items-center justify-center gap-2"
                        >
                          <Download size={18} />
                          Baixar Imagem
                        </Button>
                        <Button
                          onClick={closeModal}
                          variant="outline"
                          size="md"
                          className="flex-1"
                        >
                          Fechar
                        </Button>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)]">
                        <Clock size={12} />
                        <span>1 uso por dia</span>
                      </div>
                    </div>
                  )}

                  {/* Limit State */}
                  {state === 'limit' && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                        <Clock size={28} className="text-orange-500" />
                      </div>
                      <h4 className="text-lg font-bold text-[var(--text)] mb-2">
                        Limite diario atingido
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)] mb-3">
                        Voce ja usou o provador virtual hoje.
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full text-sm font-medium text-orange-700">
                        <Clock size={14} />
                        Disponivel novamente em {getCountdown()}
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {state === 'error' && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={28} className="text-red-500" />
                      </div>
                      <h4 className="text-lg font-bold text-[var(--text)] mb-2">
                        Ops, algo deu errado
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)] mb-6">
                        {error}
                      </p>
                      <Button onClick={() => setState('upload')} size="md">
                        Tentar Novamente
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
