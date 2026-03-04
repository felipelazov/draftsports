'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

function LoginForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(
    searchParams.get('error') === 'unauthorized' ? 'Este email não tem acesso admin.' : ''
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createSupabaseBrowser()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('Email ou senha inválidos.')
        return
      }

      window.location.href = '/admin'
    } catch {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="lg:hidden text-center mb-8">
        <span className="text-3xl font-black gradient-text">DRAFT</span>
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mt-1">Admin</p>
      </div>

      <h1 className="text-3xl font-black text-[var(--text)] mb-2">
        Acesso Admin
      </h1>
      <p className="text-[var(--text-secondary)] mb-8">
        Entre com suas credenciais de administrador
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            E-mail
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@draft.com"
              required
              className="w-full pl-10 pr-4 py-3 bg-[var(--bg)] rounded-xl border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            Senha
          </label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              className="w-full pl-10 pr-12 py-3 bg-[var(--bg)] rounded-xl border border-[var(--gray-200)] text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </motion.div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-1/4 w-[400px] h-[400px] bg-[#6C5CE7]/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-[300px] h-[300px] bg-[#A29BFE]/20 rounded-full blur-[80px]" />
        </div>
        <div className="relative text-center text-white p-12">
          <div className="w-20 h-20 bg-[var(--primary)]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={40} className="text-[var(--primary-light)]" />
          </div>
          <h2 className="text-4xl font-black mb-4">
            <span className="bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] bg-clip-text text-transparent">
              DRAFT
            </span>
          </h2>
          <p className="text-white/40 text-sm uppercase tracking-widest mb-2">Painel Administrativo</p>
          <p className="text-white/60 text-lg max-w-sm">
            Gerencie produtos, pedidos e configurações da loja
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
        <Suspense fallback={<div className="w-full max-w-md space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-12 rounded-xl animate-shimmer" />)}
        </div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
