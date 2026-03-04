'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

export default function RegistroPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleGoogleSignUp = async () => {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Preencha seu nome.')
      return
    }
    if (!email.trim()) {
      setError('Preencha seu email.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      const supabase = createSupabaseBrowser()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Este email ja esta cadastrado. Tente fazer login.')
        } else {
          setError(authError.message)
        }
        return
      }

      setSuccess(true)
    } catch {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-2xl font-black text-[#2D3436] mb-3">
            Verifique seu email
          </h1>
          <p className="text-[#636E72] mb-6">
            Enviamos um link de confirmacao para <strong>{email}</strong>.
            Clique no link para ativar sua conta.
          </p>
          <Link href="/login">
            <Button variant="outline">Ir para Login</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 -right-1/4 w-[400px] h-[400px] bg-[#6C5CE7]/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 -left-1/4 w-[300px] h-[300px] bg-[#A29BFE]/20 rounded-full blur-[80px]" />
        </div>
        <div className="relative text-center text-white p-12">
          <div className="text-8xl mb-6">🏆</div>
          <h2 className="text-4xl font-black mb-4">
            <span className="bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] bg-clip-text text-transparent">
              DRAFT
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-sm">
            Crie sua conta e ganhe 10% de desconto na primeira compra
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="text-3xl font-black">
              <span className="gradient-text">DRAFT</span>
            </Link>
          </div>

          <h1 className="text-3xl font-black text-[#2D3436] mb-2">
            Criar Conta
          </h1>
          <p className="text-[#636E72] mb-8">
            Cadastre-se e aproveite ofertas exclusivas
          </p>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-[#2D3436] hover:border-gray-300 transition-colors mb-6 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Cadastrar com Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-[#636E72]">ou</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#636E72] mb-1.5">
                Nome Completo
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#636E72]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full pl-10 pr-4 py-3 bg-[#F8F9FE] rounded-xl border border-gray-200 text-sm text-[#2D3436] outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#636E72] mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#636E72]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#F8F9FE] rounded-xl border border-gray-200 text-sm text-[#2D3436] outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#636E72] mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#636E72]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimo 6 caracteres"
                  className="w-full pl-10 pr-12 py-3 bg-[#F8F9FE] rounded-xl border border-gray-200 text-sm text-[#2D3436] outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#636E72]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Criando conta...
                </span>
              ) : (
                'Criar Conta'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-[#636E72] mt-6">
            Ja tem conta?{' '}
            <Link href="/login" className="text-[#6C5CE7] font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
